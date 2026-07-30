import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/apis-reference/fetch-api-product/#using-asuser');
/**
 * Detects `.asUser(accountId)` call chains (offline user impersonation) in Forge code and
 * ensures the developer knows to declare `allowImpersonation: true` on the corresponding
 * scope in manifest.yml.
 *
 * Only flags `.asUser(accountId)` (with an argument) — this is offline impersonation which
 * requires `allowImpersonation: true`. Plain `.asUser()` (no args) is the normal/recommended
 * pattern for UI Kit modules where the current user's context is available, and does NOT
 * require `allowImpersonation`.
 *
 * See: https://developer.atlassian.com/platform/forge/apis-reference/fetch-api-product/#using-asuser
 */
export const requireAllowImpersonation = createRule({
    name: 'require-allow-impersonation',
    meta: {
        type: 'problem',
        docs: {
            description: 'Require allowImpersonation: true in manifest.yml scopes when using .asUser(accountId) for offline impersonation',
        },
        messages: {
            missingAllowImpersonation: "'.asUser(accountId)' is used here for offline user impersonation. " +
                "The corresponding scope in manifest.yml must declare 'allowImpersonation: true'. " +
                'Without this, the Forge runtime will throw a 401 error at runtime. ' +
                'Update your manifest.yml scopes to use object form:\n' +
                '  permissions:\n' +
                '    scopes:\n' +
                '      read:jira-work:\n' +
                '        allowImpersonation: true\n\n' +
                'Note: If you are using .asUser() without an argument in a UI Kit module, ' +
                'this is the normal pattern and does NOT require allowImpersonation.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                // Match .asUser(accountId) — offline impersonation with an argument.
                // Plain .asUser() (no args) is the normal UI Kit pattern and does not require allowImpersonation.
                if (node.callee.type === 'MemberExpression' &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'asUser' &&
                    node.arguments.length > 0) {
                    context.report({
                        node,
                        messageId: 'missingAllowImpersonation',
                    });
                }
            },
        };
    },
});
