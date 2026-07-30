import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { ESLintUtils } from '@typescript-eslint/utils';
import { findManifestPath } from '../manifest-utils.js';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/manifest-reference/modules/web-trigger/');
const webtriggerHandlerCache = new Map();
export function clearWebtriggerAuthCacheForTests() {
    webtriggerHandlerCache.clear();
}
const HANDLER_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
function normaliseHandlerToFilePaths(manifestDir, handler) {
    const modulePath = handler.split('.')[0];
    const sourcePath = modulePath.startsWith('src/') ? modulePath : path.join('src', modulePath);
    return HANDLER_EXTENSIONS.map((extension) => path.resolve(manifestDir, `${sourcePath}${extension}`));
}
function getWebtriggerHandlerFiles(manifestPath) {
    if (webtriggerHandlerCache.has(manifestPath)) {
        return webtriggerHandlerCache.get(manifestPath);
    }
    let result;
    try {
        const manifest = parseYaml(fs.readFileSync(manifestPath, 'utf-8'));
        const functionModules = manifest?.modules?.function;
        const webtriggerModules = manifest?.modules?.webtrigger;
        if (!Array.isArray(functionModules) || !Array.isArray(webtriggerModules)) {
            result = new Set();
        }
        else {
            const functionHandlers = new Map();
            for (const functionModule of functionModules) {
                if (typeof functionModule.key === 'string' && typeof functionModule.handler === 'string') {
                    functionHandlers.set(functionModule.key, functionModule.handler);
                }
            }
            result = new Set();
            const manifestDir = path.dirname(manifestPath);
            for (const webtriggerModule of webtriggerModules) {
                if (typeof webtriggerModule.function !== 'string') {
                    continue;
                }
                const handler = functionHandlers.get(webtriggerModule.function);
                if (handler) {
                    for (const handlerFilePath of normaliseHandlerToFilePaths(manifestDir, handler)) {
                        result.add(handlerFilePath);
                    }
                }
            }
        }
    }
    catch {
        result = null;
    }
    webtriggerHandlerCache.set(manifestPath, result);
    return result;
}
function isCurrentFileWebtriggerHandler(filename) {
    if (!filename || filename === '<input>' || filename === '<text>') {
        return false;
    }
    const absolutePath = path.isAbsolute(filename) ? filename : path.resolve(filename);
    const manifestPath = findManifestPath(path.dirname(absolutePath));
    if (!manifestPath) {
        return false;
    }
    const handlers = getWebtriggerHandlerFiles(manifestPath);
    return handlers?.has(absolutePath) ?? false;
}
function stringValue(node) {
    if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }
    if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0]?.value.cooked ?? node.quasis[0]?.value.raw ?? null;
    }
    return null;
}
function memberPropertyName(node) {
    if (node.property.type === 'Identifier' && !node.computed) {
        return node.property.name;
    }
    if (node.property.type === 'Literal' && typeof node.property.value === 'string') {
        return node.property.value;
    }
    return null;
}
function objectPropertyName(node) {
    if (node.type === 'Identifier') {
        return node.name;
    }
    if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }
    return null;
}
function hasStatusCode(node, statusCodes) {
    return node.properties.some((property) => {
        if (property.type !== 'Property' || objectPropertyName(property.key) !== 'statusCode') {
            return false;
        }
        return (property.value.type === 'Literal' &&
            typeof property.value.value === 'number' &&
            statusCodes.has(property.value.value));
    });
}
function walk(node, visit, seen = new WeakSet()) {
    if (!node || typeof node !== 'object') {
        return;
    }
    if (seen.has(node)) {
        return;
    }
    seen.add(node);
    const current = node;
    if (typeof current.type === 'string') {
        visit(node);
    }
    for (const [key, value] of Object.entries(current)) {
        if (key === 'parent') {
            continue;
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                walk(item, visit, seen);
            }
        }
        else if (value && typeof value === 'object') {
            walk(value, visit, seen);
        }
    }
}
function hasWebtriggerAuthGuard(program) {
    let readsRequestHeaders = false;
    let referencesAuthorization = false;
    let returnsUnauthorized = false;
    walk(program, (node) => {
        if (node.type === 'MemberExpression') {
            const propertyName = memberPropertyName(node);
            if (propertyName === 'headers') {
                readsRequestHeaders = true;
            }
            if (propertyName && /^(authorization|x-api-key|x-webhook-secret)$/i.test(propertyName)) {
                referencesAuthorization = true;
            }
        }
        const value = stringValue(node);
        if (value && /^(authorization|x-api-key|x-webhook-secret)$/i.test(value)) {
            referencesAuthorization = true;
        }
        if (node.type === 'ObjectExpression' && hasStatusCode(node, new Set([401, 403]))) {
            returnsUnauthorized = true;
        }
    });
    return readsRequestHeaders && referencesAuthorization && returnsUnauthorized;
}
export const requireWebtriggerAuth = createRule({
    name: 'require-webtrigger-auth',
    meta: {
        type: 'problem',
        docs: {
            description: 'Require web trigger handlers to validate an authentication token before processing requests',
        },
        messages: {
            missingWebtriggerAuth: 'This function is referenced by a `webtrigger` module, but the handler does not appear to validate request authentication. ' +
                'Forge web trigger URLs have no built-in authentication. Read and validate an `Authorization` header or secret header before processing the request, and return 401/403 when validation fails.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename ?? context.getFilename?.();
        const enforce = isCurrentFileWebtriggerHandler(filename);
        return {
            Program(program) {
                if (!enforce || hasWebtriggerAuthGuard(program)) {
                    return;
                }
                context.report({
                    node: program,
                    messageId: 'missingWebtriggerAuth',
                });
            },
        };
    },
});
