import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/cloud/confluence/rest/v2/intro/');
/**
 * Disallow Confluence v1 REST endpoints that have been removed.
 *
 * The runtime equivalent (`checkRemovedV1ConfluenceEndpoint` in the
 * testing framework) is spec-driven; this static rule mirrors the same
 * policy with a hand-maintained denylist so lint stays deterministic
 * without shipping the v1 OpenAPI spec into the ESLint plugin.
 *
 * Allowed (no v2 equivalent — must NOT be flagged):
 *   /wiki/rest/api/search, /search/user, /content/search, /group(/*),
 *   /contentbody/convert/async/{to}, /longtask(/*), /audit*, /settings/*,
 *   /relation/*, /template*,
 *   /space/{key}/{permission|settings|theme|label|watch|state},
 *   /content/{id}/{label|restriction|version|copy|state|pageTree|permission|notification|pagehierarchy|history/.../macro},
 *   /content/{id}/child/attachment (POST/PUT for upload/replace; GET listing was removed).
 *
 * Blocked sub-trees (have v2 replacements):
 *   /content (root) and /content/{id} CRUD → /wiki/api/v2/pages|blogposts|custom-content
 *   /content/{id}/child/{page|blogpost|comment|custom-content} → /wiki/api/v2/pages/{id}/children
 *   /space (collection) and /space/{key} (root CRUD only) → /wiki/api/v2/spaces
 *   /space/{key}/content → /wiki/api/v2/spaces/{id}/pages|blogposts
 *   All content/space property endpoints → /wiki/api/v2/.../properties
 *   /inlinetasks → /wiki/api/v2/tasks
 *   /contentbody/convert/{to} (sync, no /async/) → /contentbody/convert/async/{to}
 *
 * Soft-warn (still works but Atlassian-flagged):
 *   /content/{id}/descendant[/{type}] (CHANGE-2461) → use v2 children API
 */
const CONFLUENCE_V1_PREFIX = '/wiki/rest/api/';
/** Allowed v1 endpoints (no v2 equivalent). Checked first. */
const ALLOWED_V1_PATTERNS = [
    /\/wiki\/rest\/api\/search(?:\/user)?\b/, // CQL search + user search
    /\/wiki\/rest\/api\/content\/search\b/, // CQL content search
    /\/wiki\/rest\/api\/group\b/, // group operations
    /\/wiki\/rest\/api\/contentbody\/convert\/async\b/, // async content body conversion
    /\/wiki\/rest\/api\/longtask\b/, // long-running task tracking
    /\/wiki\/rest\/api\/audit\b/, // audit log
    /\/wiki\/rest\/api\/settings\b/, // lookandfeel/theme/systemInfo
    /\/wiki\/rest\/api\/relation\b/, // entity relations
    /\/wiki\/rest\/api\/template\b/, // page templates / blueprints
    // Space sub-resources (bare /space and /space/{key} root are blocked separately).
    /\/wiki\/rest\/api\/space\/[^/?'"`]+\/(?:permission|settings|theme|label|watch|state)\b/,
    // Content sub-resources. `history` is excluded — the bare endpoint was removed; only
    // the history/{version}/macro sub-path (next pattern) is still v1.
    /\/wiki\/rest\/api\/content\/[^/?'"`]+\/(?:label|restriction|version|copy|state|pageTree|permission|notification|pagehierarchy)\b/,
    /\/wiki\/rest\/api\/content\/[^/?'"`]+\/history\/[^/?'"`]+\/macro\b/,
    // Attachment URL: POST (upload) and PUT (replace) are still v1. GET (listing) was
    // removed but ESLint can't see the method — the runtime 410-check handles that.
    /\/wiki\/rest\/api\/content\/[^/?'"`]+\/child\/attachment\b/,
];
/** Removed v1 endpoints (CHANGE-2520 et al.). */
const REMOVED_V1_PATTERNS = [
    {
        reason: 'Synchronous content body conversion was removed',
        replacement: '/wiki/rest/api/contentbody/convert/async/{to}',
        // /contentbody/convert/<segment> but NOT /async/...
        pattern: /\/wiki\/rest\/api\/contentbody\/convert\/(?!async\b)[^/?'"`]+/,
    },
    {
        reason: 'Inline tasks endpoints were removed',
        replacement: '/wiki/api/v2/tasks',
        pattern: /\/wiki\/rest\/api\/inlinetasks\b/,
    },
    {
        reason: 'Content / page / attachment CRUD via /wiki/rest/api/content was removed',
        replacement: '/wiki/api/v2/pages, /blogposts, /custom-content, or /attachments',
        // /content root and /content/{id} + child/<non-attachment> + property*.
        // ALLOWED_V1_PATTERNS runs first, so /content/search and sub-resources are exempted.
        pattern: /\/wiki\/rest\/api\/content(?:\/[^/?'"`]+(?:\/(?:child\/(?!attachment\b)[^/?'"`]+|property|history|comment))?)?(?=[/?'"`]|$)/,
    },
    {
        reason: 'Space CRUD via /wiki/rest/api/space was removed',
        replacement: '/wiki/api/v2/spaces',
        // /space and /space/{key} root. Sub-resources are exempted by ALLOWED_V1_PATTERNS.
        pattern: /\/wiki\/rest\/api\/space(?:\/[^/?'"`]+)?(?=[?'"`]|$)/,
    },
];
/** Soft-warn: still works, but flagged deprecated by Atlassian. */
const DEPRECATED_V1_PATTERNS = [
    {
        reason: 'Get content descendants is deprecated (CHANGE-2461)',
        replacement: '/wiki/api/v2/pages/{id}/children (with pagination)',
        pattern: /\/wiki\/rest\/api\/content\/[^/?'"`]+\/descendant\b/,
    },
];
function classifyConfluenceV1(value) {
    if (!value.includes(CONFLUENCE_V1_PREFIX))
        return null;
    if (ALLOWED_V1_PATTERNS.some((p) => p.test(value)))
        return null;
    // Deprecated patterns are more specific than the broad REMOVED `content` sub-tree,
    // so check them first — otherwise /content/{id}/descendant would hard-error.
    for (const entry of DEPRECATED_V1_PATTERNS) {
        if (entry.pattern.test(value)) {
            return { kind: 'deprecated', reason: entry.reason, replacement: entry.replacement };
        }
    }
    for (const entry of REMOVED_V1_PATTERNS) {
        if (entry.pattern.test(value)) {
            return { kind: 'removed', reason: entry.reason, replacement: entry.replacement };
        }
    }
    return null;
}
export const noConfluenceV1Api = createRule({
    name: 'no-confluence-v1-api',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow Confluence v1 REST API paths that were removed in CHANGE-2520; allow v1 paths that have no v2 equivalent',
        },
        messages: {
            // Kept short on purpose — full allow/block list is in the rule's JSDoc above.
            confluenceV1Removed: 'Confluence v1 REST endpoint removed on 1 May 2025 (HTTP 410). {{reason}}. Use {{replacement}}. (See ESLint rule `no-confluence-v1-api` JSDoc for the list of still-valid v1 endpoints.)',
            confluenceV1Deprecated: 'Confluence v1 REST endpoint deprecated by Atlassian (still works). {{reason}}. Prefer {{replacement}}.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        function reportIfV1Removed(node, value) {
            const match = classifyConfluenceV1(value);
            if (!match)
                return false;
            const messageId = match.kind === 'removed' ? 'confluenceV1Removed' : 'confluenceV1Deprecated';
            context.report({
                node,
                messageId,
                data: { reason: match.reason, replacement: match.replacement },
            });
            return true;
        }
        return {
            Literal(node) {
                if (typeof node.value === 'string') {
                    reportIfV1Removed(node, node.value);
                }
            },
            TemplateLiteral(node) {
                // Join quasis with a placeholder so the whole path is classified at once —
                // checking each quasi alone loses the suffix context (e.g. `/content/${id}/label`
                // looks like a removed /content path if you only see the first quasi).
                const joined = node.quasis.map((q) => q.value.raw).join('__id__');
                reportIfV1Removed(node, joined);
            },
        };
    },
});
