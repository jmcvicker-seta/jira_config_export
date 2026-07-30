import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { findManifestPath, isManifestEntryPoint } from '../manifest-utils.js';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
export const requireForgeReconciler = createRule({
    name: 'require-forge-reconciler',
    meta: {
        type: 'problem',
        docs: {
            description: 'Require ForgeReconciler.render() in Forge UI entry-point files referenced by manifest.yml resources',
        },
        schema: [],
        messages: {
            missingRender: 'This file is a Forge UI entry point (referenced in manifest.yml resources) but does not call ForgeReconciler.render() or ForgeReconciler.addConfig(). ' +
                'Without one of these calls, the Forge runtime has nothing to mount and the UI will be blank. ' +
                'Add `ForgeReconciler.render(<YourApp />);` (for normal UI modules) or `ForgeReconciler.addConfig(<Config />);` (for config UIs such as automation:action.config or jira:customField config) at the end of the file.',
        },
    },
    defaultOptions: [],
    create(context) {
        // A file is considered to "mount" something if it calls either:
        //   - ForgeReconciler.render(...)   — normal UI modules
        //   - ForgeReconciler.addConfig(...) — config UIs (confluence:macro.config,
        //                                       automation:action.config,
        //                                       jira:customField config, etc.)
        // Both are valid termination points and the rule's intent is "this entry
        // point should mount something".
        let hasForgeReconcilerMountCall = false;
        return {
            // Detect ForgeReconciler.render(...) or ForgeReconciler.addConfig(...) calls
            CallExpression(node) {
                if (node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'ForgeReconciler' &&
                    node.callee.property.type === 'Identifier' &&
                    (node.callee.property.name === 'render' || node.callee.property.name === 'addConfig')) {
                    hasForgeReconcilerMountCall = true;
                }
            },
            // Check on exit whether this entry-point file has a render or addConfig call
            'Program:exit'(node) {
                if (hasForgeReconcilerMountCall) {
                    return;
                }
                const filename = context.filename ?? context.getFilename();
                if (!filename || filename === '<input>' || filename === '<text>') {
                    return;
                }
                const absolutePath = path.isAbsolute(filename)
                    ? filename
                    : path.resolve(filename);
                const manifestPath = findManifestPath(path.dirname(absolutePath));
                if (!manifestPath) {
                    return;
                }
                if (isManifestEntryPoint(manifestPath, absolutePath)) {
                    context.report({
                        node,
                        messageId: 'missingRender',
                    });
                }
            },
        };
    },
});
