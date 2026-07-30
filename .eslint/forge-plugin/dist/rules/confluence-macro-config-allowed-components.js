import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { findManifestPath, getEntryPointUsages } from '../manifest-utils.js';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
/**
 * Module types whose `config.resource` files render a Confluence macro config UI.
 * The restricted allow-list ONLY applies to these — automation:action,
 * jira:customField, etc. use addConfig() but with a broader set of components.
 */
const CONFLUENCE_MACRO_MODULE_TYPES = new Set(['confluence:macro', 'macro']);
/**
 * Decide whether the currently-linted file is a Confluence macro config resource.
 *
 * Returns:
 *  - true  → file is referenced as `config.resource` of a confluence:macro module
 *  - false → file IS referenced by the manifest but NOT as a confluence:macro
 *            config resource (so we should NOT fire this rule)
 *  - null  → no manifest could be located (treat as "unknown" — fall back to
 *            firing the rule to preserve back-compat with pre-existing behaviour
 *            for standalone files and tests that don't set a filename)
 */
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
        // The file isn't referenced by the manifest at all — skip.
        return false;
    }
    // Fire if at least one usage is a Confluence macro config resource.
    return usages.some((usage) => usage.role === 'config' && CONFLUENCE_MACRO_MODULE_TYPES.has(usage.moduleType));
}
// Only these components are allowed in Confluence macro config UI
const ALLOWED_CONFIG_COMPONENTS = new Set([
    'Checkbox',
    'CheckboxGroup',
    'DatePicker',
    'Label',
    'RadioGroup',
    'Select',
    'Textfield',
    'TextArea',
    'UserPicker',
    'Fragment', // React fragments are allowed for layout
]);
function getComponentName(node) {
    if (node.type === 'JSXFragment') {
        return 'Fragment';
    }
    if (node.type === 'JSXElement' && node.openingElement.name.type === 'JSXIdentifier') {
        const name = node.openingElement.name.name;
        // Skip HTML intrinsic elements (lowercase names like 'option', 'div', etc.)
        if (name[0] === name[0].toLowerCase() && name !== name.toUpperCase()) {
            return null;
        }
        return name;
    }
    return null;
}
function isAllowedInConfig(componentName) {
    return ALLOWED_CONFIG_COMPONENTS.has(componentName);
}
function traverseJSXChildren(node, callback) {
    const children = node.type === 'JSXFragment' ? node.children : node.children;
    if (!children)
        return;
    children.forEach((child) => {
        if (child.type === 'JSXElement' || child.type === 'JSXFragment') {
            callback(child);
            traverseJSXChildren(child, callback);
        }
    });
}
export const confluenceMacroConfigAllowedComponents = createRule({
    name: 'confluence-macro-config-allowed-components',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce that Confluence macro configuration UI only uses allowed UI Kit components',
        },
        fixable: 'code',
        messages: {
            notAllowedInConfig: '{{componentName}} is not allowed in Confluence macro config UI. Only these components are allowed: Checkbox, CheckboxGroup, DatePicker, Label, RadioGroup, Select, Textfield, TextArea, UserPicker',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        // Determine once per file whether the macro restriction applies. If the
        // file IS in a Forge project but is NOT a confluence:macro config resource
        // (e.g. it's an automation:action config), skip — those have a different
        // allow-list and the restriction would be a false positive.
        //
        // When no manifest can be located (standalone files, tests without a
        // filename, lint-via-CI of a single file), we fall back to firing the rule
        // — back-compat with the historical unconditional behaviour.
        const filename = context.filename ?? context.getFilename?.();
        const macroCheck = isConfluenceMacroConfigFile(filename);
        const enforce = macroCheck === null ? true : macroCheck;
        return {
            CallExpression(node) {
                if (!enforce) {
                    return;
                }
                // Look for ForgeReconciler.addConfig(...) calls
                if (node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'ForgeReconciler' &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'addConfig' &&
                    node.arguments.length > 0) {
                    const configArg = node.arguments[0];
                    // Check if the argument is a JSX element
                    if (configArg.type === 'JSXElement' || configArg.type === 'JSXFragment') {
                        validateConfigUI(configArg, context);
                    }
                }
            },
        };
    },
});
function validateConfigUI(configNode, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
context) {
    // First, check the root element itself (unless it's a Fragment)
    if (configNode.type === 'JSXElement') {
        const rootComponentName = getComponentName(configNode);
        if (rootComponentName && !isAllowedInConfig(rootComponentName)) {
            context.report({
                node: configNode,
                messageId: 'notAllowedInConfig',
                data: { componentName: rootComponentName },
            });
            return; // If root is invalid, don't check children
        }
    }
    // Then check all children recursively
    traverseJSXChildren(configNode, (child) => {
        const componentName = getComponentName(child);
        if (!componentName)
            return;
        // Check if component is allowed
        if (!isAllowedInConfig(componentName)) {
            context.report({
                node: child,
                messageId: 'notAllowedInConfig',
                data: { componentName },
            });
        }
    });
}
