"use strict";
/**
 * FixtureStore — loads and matches fixture data for product API calls.
 *
 * Supports:
 * - File-based fixtures (convention-based directory structure)
 * - Programmatic fixtures (handler functions)
 * - Per-test overrides
 * - Actionable error messages when no fixture matches
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureStore = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
// Resolve current directory in both ESM and CJS environments
const _currentDir = typeof __dirname !== 'undefined' ? __dirname : eval("import.meta.dirname");
const DEFAULTS_DIR = (0, path_1.join)(_currentDir, 'defaults');
const PATH_CONVENTIONS = [
    // Jira Platform
    {
        pattern: /^\/rest\/api\/\d+\/issue\/([^/?]+)/,
        toFixturePath: (m) => `jira/issues/${m[1]}.json`,
        description: 'fixtures/jira/issues/{issueKey}.json',
    },
    {
        pattern: /^\/rest\/api\/\d+\/project\/([^/?]+)/,
        toFixturePath: (m) => `jira/projects/${m[1]}.json`,
        description: 'fixtures/jira/projects/{projectKey}.json',
    },
    {
        pattern: /^\/rest\/api\/\d+\/search\/jql/,
        toFixturePath: () => `jira/search-jql.json`,
        description: 'fixtures/jira/search-jql.json',
    },
    {
        pattern: /^\/rest\/api\/\d+\/search/,
        toFixturePath: () => `jira/search.json`,
        description: 'fixtures/jira/search.json',
    },
    {
        pattern: /^\/rest\/api\/\d+\/myself/,
        toFixturePath: () => `jira/myself.json`,
        description: 'fixtures/jira/myself.json',
    },
    {
        pattern: /^\/rest\/api\/\d+\/filter\/([^/?]+)/,
        toFixturePath: (m) => `jira/filters/${m[1]}.json`,
        description: 'fixtures/jira/filters/{filterId}.json',
    },
    // Jira Agile
    {
        pattern: /^\/rest\/agile\/[\d.]+\/board\/([^/?]+)/,
        toFixturePath: (m) => `jira/boards/${m[1]}.json`,
        description: 'fixtures/jira/boards/{boardId}.json',
    },
    {
        pattern: /^\/rest\/agile\/[\d.]+\/sprint\/([^/?]+)/,
        toFixturePath: (m) => `jira/sprints/${m[1]}.json`,
        description: 'fixtures/jira/sprints/{sprintId}.json',
    },
    // JSM
    {
        pattern: /^\/rest\/servicedeskapi\/servicedesk\/([^/?]+)/,
        toFixturePath: (m) => `jira-service-management/servicedesks/${m[1]}.json`,
        description: 'fixtures/jira-service-management/servicedesks/{serviceDeskId}.json',
    },
    {
        pattern: /^\/rest\/servicedeskapi\/request\/([^/?]+)/,
        toFixturePath: (m) => `jira-service-management/requests/${m[1]}.json`,
        description: 'fixtures/jira-service-management/requests/{issueIdOrKey}.json',
    },
    // Confluence — specific sub-resource paths (must come before broad page pattern)
    {
        pattern: /^\/wiki\/api\/v2\/pages\/([^/?]+)\/properties\/([^/?]+)/,
        toFixturePath: (m) => `confluence/pages/${m[1]}/properties/${m[2]}.json`,
        description: 'fixtures/confluence/pages/{pageId}/properties/{propertyKey}.json',
    },
    {
        pattern: /^\/wiki\/api\/v2\/pages\/([^/?]+)\/properties/,
        toFixturePath: (m) => `confluence/pages/${m[1]}/properties.json`,
        description: 'fixtures/confluence/pages/{pageId}/properties.json',
    },
    {
        pattern: /^\/wiki\/api\/v2\/pages\/([^/?]+)\/footer-comments/,
        toFixturePath: (m) => `confluence/pages/${m[1]}/footer-comments.json`,
        description: 'fixtures/confluence/pages/{pageId}/footer-comments.json',
    },
    // Confluence — broad resource patterns
    {
        pattern: /^\/wiki\/api\/v2\/pages\/([^/?]+)/,
        toFixturePath: (m) => `confluence/pages/${m[1]}.json`,
        description: 'fixtures/confluence/pages/{pageId}.json',
    },
    {
        pattern: /^\/wiki\/api\/v2\/footer-comments/,
        toFixturePath: () => `confluence/footer-comments.json`,
        description: 'fixtures/confluence/footer-comments.json',
    },
    {
        pattern: /^\/wiki\/api\/v2\/blogposts\/([^/?]+)/,
        toFixturePath: (m) => `confluence/blogposts/${m[1]}.json`,
        description: 'fixtures/confluence/blogposts/{blogpostId}.json',
    },
    {
        pattern: /^\/wiki\/api\/v2\/spaces\/([^/?]+)/,
        toFixturePath: (m) => `confluence/spaces/${m[1]}.json`,
        description: 'fixtures/confluence/spaces/{spaceKey}.json',
    },
];
const DEFAULT_CONVENTIONS = [
    // ── Jira Platform — specific resource endpoints (must come before collection endpoints) ──
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/comment/, methods: ['GET'], defaultFile: 'jira/comments.json' },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/comment/, methods: ['POST'], defaultFile: 'jira/add-comment.json', status: 201 },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/transitions/, methods: ['GET'], defaultFile: 'jira/transitions.json' },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/transitions/, methods: ['POST'], defaultFile: 'jira/transition-issue.json', status: 204 },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/worklog/, methods: ['GET'], defaultFile: 'jira/worklogs.json' },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+\/watchers/, methods: ['GET'], defaultFile: 'jira/watchers.json' },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/issue.json' },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+/, methods: ['PUT'], defaultFile: 'jira/update-issue.json', status: 204 },
    { pattern: /^\/rest\/api\/\d+\/issue\/[^/?]+/, methods: ['DELETE'], defaultFile: 'jira/delete-issue.json', status: 204 },
    { pattern: /^\/rest\/api\/\d+\/project\/search/, methods: ['GET'], defaultFile: 'jira/project-search.json' },
    { pattern: /^\/rest\/api\/\d+\/project\/[^/?]+\/components/, methods: ['GET'], defaultFile: 'jira/components.json' },
    { pattern: /^\/rest\/api\/\d+\/project\/[^/?]+\/versions/, methods: ['GET'], defaultFile: 'jira/versions.json' },
    { pattern: /^\/rest\/api\/\d+\/project\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/project.json' },
    { pattern: /^\/rest\/api\/\d+\/filter\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/filter.json' },
    // Jira Platform — collection/singleton endpoints
    { pattern: /^\/rest\/api\/\d+\/issue\b/, methods: ['POST'], defaultFile: 'jira/create-issue.json', status: 201 },
    { pattern: /^\/rest\/api\/\d+\/project\b/, methods: ['GET'], defaultFile: 'jira/projects.json' },
    { pattern: /^\/rest\/api\/\d+\/search\/jql/, methods: ['GET'], defaultFile: 'jira/search-jql.json' },
    { pattern: /^\/rest\/api\/\d+\/search/, methods: ['GET'], defaultFile: 'jira/search.json' },
    { pattern: /^\/rest\/api\/\d+\/myself/, methods: ['GET'], defaultFile: 'jira/myself.json' },
    { pattern: /^\/rest\/api\/\d+\/issuetype/, methods: ['GET'], defaultFile: 'jira/issuetype.json' },
    { pattern: /^\/rest\/api\/\d+\/priority/, methods: ['GET'], defaultFile: 'jira/priority.json' },
    { pattern: /^\/rest\/api\/\d+\/resolution/, methods: ['GET'], defaultFile: 'jira/resolutions.json' },
    { pattern: /^\/rest\/api\/\d+\/status/, methods: ['GET'], defaultFile: 'jira/status.json' },
    { pattern: /^\/rest\/api\/\d+\/field\b/, methods: ['GET'], defaultFile: 'jira/fields.json' },
    { pattern: /^\/rest\/api\/\d+\/filter\/favourite/, methods: ['GET'], defaultFile: 'jira/filters.json' },
    { pattern: /^\/rest\/api\/\d+\/filter\b/, methods: ['GET'], defaultFile: 'jira/filters.json' },
    { pattern: /^\/rest\/api\/\d+\/label/, methods: ['GET'], defaultFile: 'jira/labels.json' },
    { pattern: /^\/rest\/api\/\d+\/dashboard/, methods: ['GET'], defaultFile: 'jira/dashboards.json' },
    { pattern: /^\/rest\/api\/\d+\/user\/search/, methods: ['GET'], defaultFile: 'jira/users.json' },
    { pattern: /^\/rest\/api\/\d+\/groups\/picker/, methods: ['GET'], defaultFile: 'jira/groups.json' },
    { pattern: /^\/rest\/api\/\d+\/mypermissions/, methods: ['GET'], defaultFile: 'jira/permissions.json' },
    { pattern: /^\/rest\/api\/\d+\/serverInfo/, methods: ['GET'], defaultFile: 'jira/serverinfo.json' },
    // ── Jira Software (Agile) — specific resources first ──
    { pattern: /^\/rest\/agile\/[\d.]+\/sprint\/[^/?]+\/issue/, methods: ['GET'], defaultFile: 'jira/sprint-issues.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/sprint\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/sprint.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/board\/[^/?]+\/sprint/, methods: ['GET'], defaultFile: 'jira/sprints.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/board\/[^/?]+\/backlog/, methods: ['GET'], defaultFile: 'jira/backlog.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/board\/[^/?]+\/epic/, methods: ['GET'], defaultFile: 'jira/epic.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/board\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/board.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/board\b/, methods: ['GET'], defaultFile: 'jira/boards.json' },
    { pattern: /^\/rest\/agile\/[\d.]+\/epic\/[^/?]+/, methods: ['GET'], defaultFile: 'jira/epic.json' },
    // ── Jira Service Management ──
    { pattern: /^\/rest\/servicedeskapi\/servicedesk\/[^/?]+\/queue\/[^/?]+/, methods: ['GET'], defaultFile: 'jira-service-management/queue.json' },
    { pattern: /^\/rest\/servicedeskapi\/servicedesk\/[^/?]+\/queue/, methods: ['GET'], defaultFile: 'jira-service-management/queues.json' },
    { pattern: /^\/rest\/servicedeskapi\/servicedesk\/[^/?]+\/requesttype/, methods: ['GET'], defaultFile: 'jira-service-management/requesttypes.json' },
    { pattern: /^\/rest\/servicedeskapi\/servicedesk\/[^/?]+/, methods: ['GET'], defaultFile: 'jira-service-management/servicedesk.json' },
    { pattern: /^\/rest\/servicedeskapi\/servicedesk\b/, methods: ['GET'], defaultFile: 'jira-service-management/servicedesks.json' },
    { pattern: /^\/rest\/servicedeskapi\/request\/[^/?]+/, methods: ['GET'], defaultFile: 'jira-service-management/request.json' },
    { pattern: /^\/rest\/servicedeskapi\/request\b/, methods: ['GET'], defaultFile: 'jira-service-management/requests.json' },
    { pattern: /^\/rest\/servicedeskapi\/organization\b/, methods: ['GET'], defaultFile: 'jira-service-management/organizations.json' },
    // ── Confluence — specific sub-resource endpoints (must come before broader page patterns) ──
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/properties\/[^/?]+/, methods: ['GET'], defaultFile: 'confluence/page-property.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/properties\/[^/?]+/, methods: ['PUT'], defaultFile: 'confluence/page-property.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/properties/, methods: ['GET'], defaultFile: 'confluence/page-properties.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/properties/, methods: ['POST'], defaultFile: 'confluence/page-property.json', status: 200 },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/children/, methods: ['GET'], defaultFile: 'confluence/page-children.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/labels/, methods: ['GET'], defaultFile: 'confluence/page-labels.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+\/footer-comments/, methods: ['GET'], defaultFile: 'confluence/page-comments.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+/, methods: ['GET'], defaultFile: 'confluence/page.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+/, methods: ['PUT'], defaultFile: 'confluence/update-page.json' },
    { pattern: /^\/wiki\/api\/v2\/pages\/[^/?]+/, methods: ['DELETE'], defaultFile: 'confluence/delete-page.json', status: 204 },
    { pattern: /^\/wiki\/api\/v2\/blogposts\/[^/?]+/, methods: ['GET'], defaultFile: 'confluence/blogpost.json' },
    { pattern: /^\/wiki\/api\/v2\/spaces\/[^/?]+/, methods: ['GET'], defaultFile: 'confluence/space.json' },
    // Confluence — collection/search endpoints
    { pattern: /^\/wiki\/api\/v2\/footer-comments\b/, methods: ['POST'], defaultFile: 'confluence/create-footer-comment.json', status: 201 },
    { pattern: /^\/wiki\/api\/v2\/pages\b/, methods: ['POST'], defaultFile: 'confluence/create-page.json' },
    { pattern: /^\/wiki\/api\/v2\/blogposts\b/, methods: ['GET'], defaultFile: 'confluence/blogposts.json' },
    { pattern: /^\/wiki\/api\/v2\/custom-content\b/, methods: ['GET'], defaultFile: 'confluence/custom-content.json' },
    { pattern: /^\/wiki\/api\/v2\/spaces\b/, methods: ['GET'], defaultFile: 'confluence/spaces.json' },
    { pattern: /^\/wiki\/rest\/api\/content\/[^/?]+\/label/, methods: ['POST'], defaultFile: 'confluence/add-label.json' },
    { pattern: /^\/wiki\/rest\/api\/content\/search/, methods: ['GET'], defaultFile: 'confluence/search-content.json' },
];
class FixtureStore {
    fixtureDir;
    handlers;
    useDefaults;
    overrides = new Map();
    fileCache = new Map();
    defaultCache = new Map();
    constructor(options = {}) {
        this.fixtureDir = options.fixtureDir;
        this.handlers = options.handlers ?? [];
        this.useDefaults = options.useDefaults ?? true;
    }
    /**
     * Set the fixture directory for file-based fixtures.
     * Used by TestHarness to configure the global singleton's store.
     */
    setFixtureDir(dir) {
        this.fixtureDir = dir;
        this.fileCache.clear();
    }
    /**
     * Look up a fixture for the given method and path.
     *
     * Lookup order (first match wins):
     * 1. Per-test overrides (exact match on method + path)
     * 2. File-based fixtures (convention-based path mapping from user's fixtures/ dir)
     * 3. Programmatic handlers
     * 4. Default fixtures (built-in responses for common APIs, enabled by default)
     */
    lookup(method, path, options) {
        const normalizedMethod = method.toUpperCase();
        const overrideKey = this.overrideKey(normalizedMethod, path);
        // 1. Check overrides
        const override = this.overrides.get(overrideKey);
        if (override) {
            return { found: true, response: override };
        }
        // 2. Check file-based fixtures
        if (this.fixtureDir) {
            const fileResult = this.lookupFile(path);
            if (fileResult.found)
                return fileResult;
        }
        // 3. Check programmatic handlers
        for (const handler of this.handlers) {
            const response = handler(normalizedMethod, path, options);
            if (response) {
                return { found: true, response };
            }
        }
        // 4. Check default fixtures
        if (this.useDefaults) {
            const defaultResult = this.lookupDefault(normalizedMethod, path);
            if (defaultResult.found)
                return defaultResult;
        }
        return { found: false };
    }
    /**
     * Set a per-test override for a specific method + path.
     * Overrides take priority over file-based and programmatic fixtures.
     */
    override(method, path, response) {
        this.overrides.set(this.overrideKey(method.toUpperCase(), path), response);
    }
    /**
     * Add a programmatic fixture handler.
     */
    addHandler(handler) {
        this.handlers.push(handler);
    }
    /**
     * Clear all per-test overrides, programmatic handlers, and caches.
     * Call between tests for full isolation.
     */
    reset() {
        this.overrides.clear();
        this.handlers.length = 0;
        this.fileCache.clear();
    }
    /**
     * Look up a default fixture by matching the path against built-in conventions.
     */
    lookupDefault(method, path) {
        for (const convention of DEFAULT_CONVENTIONS) {
            if (convention.methods && !convention.methods.includes(method))
                continue;
            if (!convention.pattern.test(path))
                continue;
            const status = convention.status ?? 200;
            const cacheKey = `${method}:${convention.defaultFile}`;
            // Check cache
            const cached = this.defaultCache.get(cacheKey);
            if (cached) {
                console.log(`[test-harness] ${method} ${path} → using built-in default fixture '${convention.defaultFile}'. ` +
                    `To customize this response, use: harness.addFixture('${method}', '${path}', { status: ${status}, body: { /* your response */ } })`);
                return { found: true, response: cached };
            }
            const fullPath = (0, path_1.join)(DEFAULTS_DIR, convention.defaultFile);
            if (!(0, fs_1.existsSync)(fullPath))
                continue;
            try {
                const content = (0, fs_1.readFileSync)(fullPath, 'utf-8');
                const body = JSON.parse(content);
                const response = { status, body };
                this.defaultCache.set(cacheKey, response);
                console.log(`[test-harness] ${method} ${path} → using built-in default fixture '${convention.defaultFile}'. ` +
                    `To customize this response, use: harness.addFixture('${method}', '${path}', { status: ${status}, body: { /* your response */ } })`);
                return { found: true, response };
            }
            catch {
                continue;
            }
        }
        return { found: false };
    }
    /**
     * Build an actionable error message when no fixture is found.
     */
    buildMissingFixtureError(method, path) {
        const normalizedMethod = method.toUpperCase();
        const lines = [
            `No fixture found for ${normalizedMethod} ${path}.`,
            '',
            'To fix this, add a fixture that returns the expected API response for this endpoint.',
            'Use harness.addFixture() in your test\'s beforeEach:',
            '',
            `  harness.addFixture('${normalizedMethod}', '${path}', {`,
            `    status: 200,`,
            `    body: { /* the JSON response your code expects from this API call */ }`,
            `  });`,
            '',
        ];
        // Suggest a file-based fixture if we can map the path
        const suggestion = this.suggestFixturePath(path);
        if (suggestion && this.fixtureDir) {
            lines.push('Or create a fixture file:', `  ${this.fixtureDir}/${suggestion}`, '');
        }
        lines.push('Tip: Check the Confluence/Jira REST API docs for the expected response shape,', 'or log the real response from your app to see what structure is needed.');
        return lines.join('\n');
    }
    /**
     * Load all fixture files from the fixture directory (for inspection/debugging).
     */
    listFixtureFiles() {
        if (!this.fixtureDir || !(0, fs_1.existsSync)(this.fixtureDir))
            return [];
        return this.walkDir(this.fixtureDir).map((f) => (0, path_1.relative)(this.fixtureDir, f));
    }
    lookupFile(path) {
        const fixturePath = this.suggestFixturePath(path);
        if (!fixturePath || !this.fixtureDir)
            return { found: false };
        const fullPath = (0, path_1.join)(this.fixtureDir, fixturePath);
        // Check cache
        const cached = this.fileCache.get(fullPath);
        if (cached)
            return { found: true, response: cached, matchedFile: fullPath };
        if (!(0, fs_1.existsSync)(fullPath))
            return { found: false };
        try {
            const content = (0, fs_1.readFileSync)(fullPath, 'utf-8');
            const body = JSON.parse(content);
            const response = { status: 200, body };
            this.fileCache.set(fullPath, response);
            return { found: true, response, matchedFile: fullPath };
        }
        catch {
            return { found: false };
        }
    }
    suggestFixturePath(apiPath) {
        for (const convention of PATH_CONVENTIONS) {
            const match = apiPath.match(convention.pattern);
            if (match)
                return convention.toFixturePath(match);
        }
        return undefined;
    }
    /**
     * Strip query params from a path so overrides match regardless of query string.
     * e.g. `/rest/api/3/search?jql=...` → `/rest/api/3/search`
     */
    stripQueryParams(path) {
        const idx = path.indexOf('?');
        return idx >= 0 ? path.substring(0, idx) : path;
    }
    /**
     * Decode percent-encoded sequences in a path so override keys match whether
     * the path was built with `route\`/x/${value}\`` (which percent-encodes the
     * interpolated value via encodeURIComponent) or with the unencoded form
     * passed to `harness.addFixture('METHOD', '/x/value', ...)`.
     *
     * Falls back to the raw path if the URI contains a malformed escape sequence
     * (decodeURIComponent throws on '%' followed by non-hex chars).
     */
    decodePath(path) {
        if (!path.includes('%'))
            return path;
        try {
            return decodeURIComponent(path);
        }
        catch {
            return path;
        }
    }
    overrideKey(method, path) {
        return `${method} ${this.decodePath(this.stripQueryParams(path))}`;
    }
    walkDir(dir) {
        const files = [];
        for (const entry of (0, fs_1.readdirSync)(dir, { withFileTypes: true })) {
            const fullPath = (0, path_1.join)(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...this.walkDir(fullPath));
            }
            else if (entry.isFile() && entry.name.endsWith('.json')) {
                files.push(fullPath);
            }
        }
        return files;
    }
}
exports.FixtureStore = FixtureStore;
