import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/apis');
export const noDoubleEncodeRoute = createRule({
    name: 'no-double-encode-route',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow encodeURIComponent() inside route`` tagged templates — route auto-encodes query parameters',
        },
        messages: {
            noDoubleEncode: 'Do not use encodeURIComponent() inside a route`` tagged template. The route tag automatically encodes interpolated values in query position. Using encodeURIComponent() will cause double-encoding (e.g., spaces become %2520 instead of %20). Pass the raw value directly.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            TaggedTemplateExpression(node) {
                // Check if the tag is `route`
                if (node.tag.type !== 'Identifier' || node.tag.name !== 'route')
                    return;
                for (const expression of node.quasi.expressions) {
                    if (expression.type === 'CallExpression' &&
                        expression.callee.type === 'Identifier' &&
                        expression.callee.name === 'encodeURIComponent') {
                        context.report({
                            node: expression,
                            messageId: 'noDoubleEncode',
                        });
                    }
                }
            },
        };
    },
});
