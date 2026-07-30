import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/');
/**
 * Regex that matches the deprecated `/rest/api/3/search` endpoint path
 * but NOT `/rest/api/3/search/jql` (the replacement).
 *
 * Matches when `/rest/api/3/search` is followed by end-of-string, a query
 * string (`?`), or a quote character — i.e. it's the complete path segment.
 */
const DEPRECATED_SEARCH_PATTERN = /\/rest\/api\/3\/search(?:[?'"`\s]|$)/;
function containsDeprecatedSearch(value) {
    if (!value.includes('/rest/api/3/search'))
        return false;
    if (value.includes('/rest/api/3/search/'))
        return false;
    return DEPRECATED_SEARCH_PATTERN.test(value);
}
export const noDeprecatedSearchEndpoint = createRule({
    name: 'no-deprecated-search-endpoint',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow the deprecated /rest/api/3/search endpoint; require /rest/api/3/search/jql instead',
        },
        messages: {
            deprecatedSearch: 'The /rest/api/3/search endpoint is deprecated and being removed. Use /rest/api/3/search/jql instead.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            Literal(node) {
                if (typeof node.value === 'string' && containsDeprecatedSearch(node.value)) {
                    context.report({ node, messageId: 'deprecatedSearch' });
                }
            },
            TemplateLiteral(node) {
                for (const quasi of node.quasis) {
                    if (containsDeprecatedSearch(quasi.value.raw)) {
                        context.report({ node, messageId: 'deprecatedSearch' });
                        return; // one report per template literal is enough
                    }
                }
            },
        };
    },
});
