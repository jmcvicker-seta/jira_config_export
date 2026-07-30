import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/storage-reference/kvs-api-secret/');
const SENSITIVE_KEY_PATTERN = /(?:api[_-]?token|access[_-]?token|auth[_-]?token|bearer[_-]?token|client[_-]?secret|private[_-]?key|api[_-]?key|secret|password|passwd|credential)/i;
function getStaticString(node) {
    if (!node) {
        return null;
    }
    if (node.type === 'Literal') {
        return typeof node.value === 'string' ? node.value : null;
    }
    if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0]?.value.cooked ?? node.quasis[0]?.value.raw ?? null;
    }
    return null;
}
function getMemberPropertyName(node) {
    if (node.property.type === 'Identifier' && !node.computed) {
        return node.property.name;
    }
    if (node.property.type === 'Literal' && typeof node.property.value === 'string') {
        return node.property.value;
    }
    return null;
}
function collectForgeStorageImports(program) {
    const imports = {
        kvsNames: new Set(),
        storageNames: new Set(),
        forgeApiDefaultName: null,
    };
    for (const statement of program.body) {
        if (statement.type !== 'ImportDeclaration') {
            continue;
        }
        if (statement.source.value === '@forge/kvs') {
            for (const specifier of statement.specifiers) {
                if (specifier.type === 'ImportDefaultSpecifier') {
                    imports.kvsNames.add(specifier.local.name);
                }
                if (specifier.type === 'ImportSpecifier' &&
                    specifier.imported.type === 'Identifier' &&
                    specifier.imported.name === 'kvs') {
                    imports.kvsNames.add(specifier.local.name);
                }
            }
            continue;
        }
        if (statement.source.value === '@forge/api') {
            for (const specifier of statement.specifiers) {
                if (specifier.type === 'ImportDefaultSpecifier') {
                    imports.forgeApiDefaultName = specifier.local.name;
                }
                if (specifier.type === 'ImportSpecifier' &&
                    specifier.imported.type === 'Identifier' &&
                    specifier.imported.name === 'storage') {
                    imports.storageNames.add(specifier.local.name);
                }
            }
        }
    }
    return imports;
}
function isImportedStorageObject(node, imports) {
    if (node.type === 'Identifier') {
        return imports.kvsNames.has(node.name) || imports.storageNames.has(node.name);
    }
    if (node.type === 'MemberExpression' &&
        node.object.type === 'Identifier' &&
        imports.forgeApiDefaultName === node.object.name &&
        getMemberPropertyName(node) === 'storage') {
        return true;
    }
    if (node.type === 'MemberExpression' &&
        node.object.type === 'CallExpression' &&
        node.object.callee.type === 'MemberExpression' &&
        node.object.callee.object.type === 'Identifier' &&
        imports.forgeApiDefaultName === node.object.callee.object.name &&
        ['asApp', 'asUser'].includes(getMemberPropertyName(node.object.callee) ?? '') &&
        getMemberPropertyName(node) === 'storage') {
        return true;
    }
    return false;
}
function getSensitiveStorageKey(node) {
    const key = getStaticString(node.arguments[0]);
    if (key && SENSITIVE_KEY_PATTERN.test(key)) {
        return key;
    }
    return null;
}
export const preferKvsSecretStorage = createRule({
    name: 'prefer-kvs-secret-storage',
    meta: {
        type: 'problem',
        docs: {
            description: 'Require Forge KVS secret APIs when persisting sensitive values such as API tokens or passwords',
        },
        messages: {
            useSecretStorage: 'Sensitive key `{{ key }}` is being written with regular Forge storage. Use `kvs.setSecret` to persist secrets and `kvs.getSecret` to read them; values written with `kvs.setSecret` are only accessible through the secret API.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const imports = collectForgeStorageImports(sourceCode.ast);
        return {
            CallExpression(node) {
                if (node.callee.type !== 'MemberExpression' ||
                    getMemberPropertyName(node.callee) !== 'set' ||
                    !isImportedStorageObject(node.callee.object, imports)) {
                    return;
                }
                const sensitiveKey = getSensitiveStorageKey(node);
                if (!sensitiveKey) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'useSecretStorage',
                    data: { key: sensitiveKey },
                });
            },
        };
    },
});
