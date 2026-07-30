import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { findManifestPath, getEntryPointUsages } from '../manifest-utils.js';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit/components/textfield/');
const CONFLUENCE_MACRO_MODULE_TYPES = new Set(['confluence:macro', 'macro']);
const FIELD_COMPONENTS = new Set(['Textfield', 'TextArea']);
const SENSITIVE_FIELD_PATTERN = /(?:api[_-]?token|access[_-]?token|auth[_-]?token|bearer[_-]?token|client[_-]?secret|private[_-]?key|api[_-]?key|secret|password|passwd|credential)/i;
function isConfluenceMacroConfigFile(filename) {
    if (!filename || filename === '<input>' || filename === '<text>') {
        return null;
    }
    const absolutePath = path.isAbsolute(filename) ? filename : path.resolve(filename);
    const manifestPath = findManifestPath(path.dirname(absolutePath));
    if (!manifestPath) {
        return null;
    }
    const usages = getEntryPointUsages(manifestPath, absolutePath);
    if (usages.length === 0) {
        return false;
    }
    return usages.some((usage) => usage.role === 'config' && CONFLUENCE_MACRO_MODULE_TYPES.has(usage.moduleType));
}
function getComponentName(node) {
    if (node.openingElement.name.type !== 'JSXIdentifier') {
        return null;
    }
    return node.openingElement.name.name;
}
function getStaticAttributeValue(attribute) {
    if (!attribute.value) {
        return null;
    }
    if (attribute.value.type === 'Literal') {
        return typeof attribute.value.value === 'string' ? attribute.value.value : null;
    }
    if (attribute.value.type === 'JSXExpressionContainer' &&
        attribute.value.expression.type === 'Literal' &&
        typeof attribute.value.expression.value === 'string') {
        return attribute.value.expression.value;
    }
    return null;
}
function getSensitiveAttributeValue(node) {
    const attributesToCheck = new Set(['name', 'id', 'label', 'placeholder', 'aria-label']);
    for (const attribute of node.openingElement.attributes) {
        if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') {
            continue;
        }
        if (!attributesToCheck.has(attribute.name.name)) {
            continue;
        }
        const value = getStaticAttributeValue(attribute);
        if (value && SENSITIVE_FIELD_PATTERN.test(value)) {
            return value;
        }
    }
    return null;
}
export const noSensitiveMacroConfigFields = createRule({
    name: 'no-sensitive-macro-config-fields',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow sensitive text fields in Confluence macro config because macro config cannot reliably mask password input',
        },
        messages: {
            sensitiveMacroConfigField: 'Confluence macro config is collecting a sensitive value (`{{ value }}`) with {{ componentName }}. ' +
                'Macro config does not support masked password Textfield input, so users may see a plain text field. ' +
                'Move this setting into the rendered macro UI or another authenticated UI module, use a password Textfield there, ' +
                'and persist the value with `kvs.setSecret` / read it with `kvs.getSecret`.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename ?? context.getFilename?.();
        const macroCheck = isConfluenceMacroConfigFile(filename);
        const enforce = macroCheck === null ? true : macroCheck;
        return {
            JSXElement(node) {
                if (!enforce) {
                    return;
                }
                const componentName = getComponentName(node);
                if (!componentName || !FIELD_COMPONENTS.has(componentName)) {
                    return;
                }
                const sensitiveValue = getSensitiveAttributeValue(node);
                if (!sensitiveValue) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'sensitiveMacroConfigField',
                    data: { componentName, value: sensitiveValue },
                });
            },
        };
    },
});
