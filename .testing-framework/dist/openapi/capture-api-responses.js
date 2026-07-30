"use strict";
/**
 * Capture and sanitize real API responses from Atlassian products.
 *
 * Calls common APIs on a real Atlassian site, sanitizes the responses
 * (replacing real IDs, names, etc. with generic placeholders), and saves
 * them as ground truth references.
 *
 * These ground truths complement OpenAPI specs by capturing actual runtime
 * response shapes (which may differ from spec definitions).
 *
 * Usage:
 *   npx tsx src/openapi/capture-api-responses.ts \
 *     --site-url https://example.atlassian.net \
 *     --email user@example.com \
 *     --api-token <token> \
 *     [--output-dir ./ground-truth/api-responses]
 *
 * The site needs to have at least one project (Jira) and one space (Confluence)
 * for the capture to work. See the README for setup details.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_APIS = exports.SiteClient = void 0;
exports.sanitizeResponse = sanitizeResponse;
exports.captureAPIResponses = captureAPIResponses;
const fs_1 = require("fs");
const path_1 = require("path");
const _currentDir = typeof __dirname !== 'undefined' ? __dirname : eval("import.meta.dirname");
const DEFAULT_OUTPUT_DIR = (0, path_1.join)(_currentDir, '../../ground-truth/api-responses');
/** Simple HTTP client for an Atlassian site */
class SiteClient {
    siteUrl;
    email;
    apiToken;
    constructor(siteUrl, email, apiToken) {
        this.siteUrl = siteUrl;
        this.email = email;
        this.apiToken = apiToken;
    }
    async request(method, path) {
        const url = `${this.siteUrl}${path}`;
        const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        let body;
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
            body = await response.json();
        }
        else {
            body = await response.text();
        }
        return { status: response.status, body };
    }
    /** Get the first Jira project key available on the site */
    async getFirstProjectKey() {
        const { body } = await this.request('GET', '/rest/api/3/project?maxResults=1');
        const projects = body;
        if (!projects.length)
            throw new Error('No Jira projects found on site');
        return projects[0].key;
    }
    /** Get the first issue key in a project */
    async getFirstIssueKey(projectKey) {
        const { body } = await this.request('GET', `/rest/api/3/search/jql?jql=project%3D${projectKey}+order+by+created+DESC&maxResults=1`);
        const result = body;
        if (!result.issues?.length)
            throw new Error(`No issues found in project ${projectKey}. Create at least one issue on the test site.`);
        return result.issues[0].key;
    }
    /** Get the first Confluence space key */
    async getFirstSpaceKey() {
        const { body } = await this.request('GET', '/wiki/api/v2/spaces?limit=1');
        const result = body;
        if (!result.results.length)
            throw new Error('No Confluence spaces found on site');
        return result.results[0].key;
    }
    /** Get the first page ID in a space */
    async getFirstPageId(spaceKey) {
        const { body } = await this.request('GET', `/wiki/api/v2/spaces?keys=${spaceKey}&limit=1`);
        const spaces = body;
        if (!spaces.results.length)
            throw new Error(`Space ${spaceKey} not found`);
        const spaceId = spaces.results[0].id;
        const { body: pages } = await this.request('GET', `/wiki/api/v2/spaces/${spaceId}/pages?limit=1`);
        const pageResult = pages;
        if (!pageResult.results.length)
            throw new Error(`No pages found in space ${spaceKey}`);
        return pageResult.results[0].id;
    }
    /** Get the first Scrum board ID (for Jira Software / Agile APIs) */
    async getFirstBoardId() {
        const { body } = await this.request('GET', '/rest/agile/1.0/board?type=scrum&maxResults=1');
        const result = body;
        if (!result.values?.length) {
            // Fall back to any board type
            const { body: anyBoard } = await this.request('GET', '/rest/agile/1.0/board?maxResults=1');
            const anyResult = anyBoard;
            if (!anyResult.values?.length)
                throw new Error('No Agile boards found on site. Create a Scrum or Kanban project.');
            return anyResult.values[0].id;
        }
        return result.values[0].id;
    }
    /** Get the first sprint ID for a board */
    async getFirstSprintId(boardId) {
        const { body } = await this.request('GET', `/rest/agile/1.0/board/${boardId}/sprint?maxResults=1`);
        const result = body;
        if (!result.values?.length)
            throw new Error(`No sprints found on board ${boardId}. Create a sprint in a Scrum project.`);
        return result.values[0].id;
    }
    /** Get the first service desk ID (for JSM APIs) */
    async getFirstServiceDeskId() {
        const { body } = await this.request('GET', '/rest/servicedeskapi/servicedesk?limit=1');
        const result = body;
        if (!result.values?.length)
            throw new Error('No service desks found on site. Create a JSM project.');
        return result.values[0].id;
    }
    /** Get the first customer request key (for JSM APIs) */
    async getFirstRequestKey(serviceDeskId) {
        const { body } = await this.request('GET', `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue`);
        const queues = body;
        if (!queues.values?.length)
            throw new Error(`No queues found for service desk ${serviceDeskId}.`);
        // Try to find a request via the requests endpoint
        const { body: requests } = await this.request('GET', '/rest/servicedeskapi/request?limit=1');
        const reqResult = requests;
        if (!reqResult.values?.length)
            throw new Error('No customer requests found. Create a request in a JSM project.');
        return reqResult.values[0].issueKey;
    }
    /** Get the first queue ID for a service desk */
    async getFirstQueueId(serviceDeskId) {
        const { body } = await this.request('GET', `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue`);
        const result = body;
        if (!result.values?.length)
            throw new Error(`No queues found for service desk ${serviceDeskId}.`);
        return result.values[0].id;
    }
}
exports.SiteClient = SiteClient;
/**
 * The list of common APIs to capture.
 *
 * Based on top Forge module types in production (top_modules_in_prod.csv),
 * these are the APIs most frequently used by Forge apps building on
 * Jira issue panels, global pages, project pages, dashboards, admin pages,
 * and Confluence pages/spaces.
 */
exports.COMMON_APIS = [
    // ── Jira: Issue APIs (used by issuePanel, issueContext, issueAction, issueActivity) ──
    {
        name: 'Get Issue',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issue/{issueKey}',
        filename: 'jira/get-issue.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            const issueKey = await client.getFirstIssueKey(projectKey);
            return `/rest/api/3/issue/${issueKey}`;
        },
    },
    {
        name: 'Search Issues (JQL)',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/search/jql?jql=created+>=-30d+order+by+created+DESC&maxResults=2',
        filename: 'jira/search-issues.json',
    },
    {
        name: 'Get Issue Comments',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issue/{issueKey}/comment',
        filename: 'jira/get-issue-comments.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            const issueKey = await client.getFirstIssueKey(projectKey);
            return `/rest/api/3/issue/${issueKey}/comment`;
        },
    },
    {
        name: 'Get Issue Transitions',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issue/{issueKey}/transitions',
        filename: 'jira/get-issue-transitions.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            const issueKey = await client.getFirstIssueKey(projectKey);
            return `/rest/api/3/issue/${issueKey}/transitions`;
        },
    },
    // ── Jira: Project APIs (used by projectPage, projectSettingsPage) ──
    {
        name: 'Get Project',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/project/{projectKey}',
        filename: 'jira/get-project.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            return `/rest/api/3/project/${projectKey}`;
        },
    },
    {
        name: 'List Projects',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/project?maxResults=5',
        filename: 'jira/list-projects.json',
    },
    // ── Jira: Metadata APIs (used by customField, adminPage, dashboardGadget) ──
    {
        name: 'Get Myself',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/myself',
        filename: 'jira/get-myself.json',
    },
    {
        name: 'Get Issue Types',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issuetype',
        filename: 'jira/get-issue-types.json',
    },
    {
        name: 'Get Priorities',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/priority',
        filename: 'jira/get-priorities.json',
    },
    {
        name: 'Get Statuses',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/status',
        filename: 'jira/get-statuses.json',
    },
    {
        name: 'Get Fields',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/field',
        filename: 'jira/get-fields.json',
    },
    {
        name: 'Get Dashboards',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/dashboard?maxResults=5',
        filename: 'jira/get-dashboards.json',
    },
    {
        name: 'Search Users',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/user/search?query=a&maxResults=2',
        filename: 'jira/search-users.json',
    },
    {
        name: 'Get Server Info',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/serverInfo',
        filename: 'jira/get-server-info.json',
    },
    // ── Confluence: Page APIs (used by globalPage, spacePage, contentAction, contentBylineItem) ──
    {
        name: 'Get Page',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/pages/{pageId}?body-format=atlas_doc_format',
        filename: 'confluence/get-page.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const pageId = await client.getFirstPageId(spaceKey);
            return `/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`;
        },
    },
    {
        name: 'Get Page Children',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/pages/{pageId}/children',
        filename: 'confluence/get-page-children.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const pageId = await client.getFirstPageId(spaceKey);
            return `/wiki/api/v2/pages/${pageId}/children`;
        },
    },
    // ── Confluence: Space APIs (used by globalPage, spacePage, globalSettings) ──
    {
        name: 'List Spaces',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/spaces?limit=5',
        filename: 'confluence/list-spaces.json',
    },
    {
        name: 'Get Space',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/spaces/{spaceId}',
        filename: 'confluence/get-space.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const { body } = await client.request('GET', `/wiki/api/v2/spaces?keys=${spaceKey}&limit=1`);
            const result = body;
            if (!result.results.length)
                throw new Error(`Space ${spaceKey} not found`);
            return `/wiki/api/v2/spaces/${result.results[0].id}`;
        },
    },
    // ── Confluence: Search (used by globalPage, contentAction) ──
    {
        name: 'Search Content (CQL)',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/rest/api/content/search?cql=type=page&limit=2',
        filename: 'confluence/search-content.json',
    },
    // ── Confluence: Labels (used by contentBylineItem, contentAction) ──
    {
        name: 'Get Page Labels',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/pages/{pageId}/labels',
        filename: 'confluence/get-page-labels.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const pageId = await client.getFirstPageId(spaceKey);
            return `/wiki/api/v2/pages/${pageId}/labels`;
        },
    },
    // ── Confluence: Blog posts (used by contentAction, contextMenu) ──
    {
        name: 'List Blog Posts',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/blogposts?limit=5',
        filename: 'confluence/list-blogposts.json',
    },
    // ── Confluence: Page Properties (used by contentBylineItem) ──
    {
        name: 'Get Page Properties',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/pages/{pageId}/properties',
        filename: 'confluence/get-page-properties.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const pageId = await client.getFirstPageId(spaceKey);
            return `/wiki/api/v2/pages/${pageId}/properties`;
        },
    },
    // ── Confluence: Footer Comments (used by contentAction, contentBylineItem) ──
    {
        name: 'Get Page Footer Comments',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/pages/{pageId}/footer-comments',
        filename: 'confluence/get-page-footer-comments.json',
        resolvePath: async (client) => {
            const spaceKey = await client.getFirstSpaceKey();
            const pageId = await client.getFirstPageId(spaceKey);
            return `/wiki/api/v2/pages/${pageId}/footer-comments`;
        },
    },
    // ── Confluence: Custom Content (used by customContent module) ──
    {
        name: 'List Custom Content',
        product: 'confluence',
        method: 'GET',
        path: '/wiki/api/v2/custom-content?limit=5',
        filename: 'confluence/list-custom-content.json',
    },
    // ── Jira Software / Agile (used by boardAction, backlogAction, sprintAction) ──
    {
        name: 'List Boards',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/board?maxResults=5',
        filename: 'jira/list-boards.json',
    },
    {
        name: 'Get Board',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/board/{boardId}',
        filename: 'jira/get-board.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            return `/rest/agile/1.0/board/${boardId}`;
        },
    },
    {
        name: 'Get Board Sprints',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/board/{boardId}/sprint',
        filename: 'jira/get-board-sprints.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            return `/rest/agile/1.0/board/${boardId}/sprint`;
        },
    },
    {
        name: 'Get Sprint',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/sprint/{sprintId}',
        filename: 'jira/get-sprint.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            const sprintId = await client.getFirstSprintId(boardId);
            return `/rest/agile/1.0/sprint/${sprintId}`;
        },
    },
    {
        name: 'Get Sprint Issues',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/sprint/{sprintId}/issue?maxResults=5',
        filename: 'jira/get-sprint-issues.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            const sprintId = await client.getFirstSprintId(boardId);
            return `/rest/agile/1.0/sprint/${sprintId}/issue?maxResults=5`;
        },
    },
    {
        name: 'Get Board Backlog',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/board/{boardId}/backlog?maxResults=5',
        filename: 'jira/get-backlog.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            return `/rest/agile/1.0/board/${boardId}/backlog?maxResults=5`;
        },
    },
    {
        name: 'Get Board Epics',
        product: 'jira',
        method: 'GET',
        path: '/rest/agile/1.0/board/{boardId}/epic',
        filename: 'jira/get-board-epics.json',
        resolvePath: async (client) => {
            const boardId = await client.getFirstBoardId();
            return `/rest/agile/1.0/board/${boardId}/epic`;
        },
    },
    // ── Jira Service Management (used by portalRequestDetailPanel, queuePage, organizationPanel) ──
    {
        name: 'List Service Desks',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/servicedesk',
        filename: 'jira-service-management/list-servicedesks.json',
    },
    {
        name: 'Get Service Desk',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/servicedesk/{serviceDeskId}',
        filename: 'jira-service-management/get-servicedesk.json',
        resolvePath: async (client) => {
            const sdId = await client.getFirstServiceDeskId();
            return `/rest/servicedeskapi/servicedesk/${sdId}`;
        },
    },
    {
        name: 'List Customer Requests',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/request?limit=5',
        filename: 'jira-service-management/list-requests.json',
    },
    {
        name: 'Get Customer Request',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/request/{issueIdOrKey}',
        filename: 'jira-service-management/get-request.json',
        resolvePath: async (client) => {
            const sdId = await client.getFirstServiceDeskId();
            const requestKey = await client.getFirstRequestKey(sdId);
            return `/rest/servicedeskapi/request/${requestKey}`;
        },
    },
    {
        name: 'List Queues',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/servicedesk/{serviceDeskId}/queue',
        filename: 'jira-service-management/list-queues.json',
        resolvePath: async (client) => {
            const sdId = await client.getFirstServiceDeskId();
            return `/rest/servicedeskapi/servicedesk/${sdId}/queue`;
        },
    },
    {
        name: 'Get Queue',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/servicedesk/{serviceDeskId}/queue/{queueId}',
        filename: 'jira-service-management/get-queue.json',
        resolvePath: async (client) => {
            const sdId = await client.getFirstServiceDeskId();
            const queueId = await client.getFirstQueueId(sdId);
            return `/rest/servicedeskapi/servicedesk/${sdId}/queue/${queueId}`;
        },
    },
    {
        name: 'List Organizations',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/organization',
        filename: 'jira-service-management/list-organizations.json',
    },
    {
        name: 'List Request Types',
        product: 'jira',
        method: 'GET',
        path: '/rest/servicedeskapi/servicedesk/{serviceDeskId}/requesttype',
        filename: 'jira-service-management/list-requesttypes.json',
        resolvePath: async (client) => {
            const sdId = await client.getFirstServiceDeskId();
            return `/rest/servicedeskapi/servicedesk/${sdId}/requesttype`;
        },
    },
    // ── Jira: Additional Platform APIs (used by adminPage, dashboardGadget, issuePanel) ──
    {
        name: 'Get Filter',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/filter/favourite',
        filename: 'jira/get-filters.json',
    },
    {
        name: 'Get Issue Worklogs',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issue/{issueKey}/worklog',
        filename: 'jira/get-worklogs.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            const issueKey = await client.getFirstIssueKey(projectKey);
            return `/rest/api/3/issue/${issueKey}/worklog`;
        },
    },
    {
        name: 'Get Issue Watchers',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/issue/{issueKey}/watchers',
        filename: 'jira/get-watchers.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            const issueKey = await client.getFirstIssueKey(projectKey);
            return `/rest/api/3/issue/${issueKey}/watchers`;
        },
    },
    {
        name: 'Get Resolutions',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/resolution',
        filename: 'jira/get-resolutions.json',
    },
    {
        name: 'Get Labels',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/label?maxResults=10',
        filename: 'jira/get-labels.json',
    },
    {
        name: 'Get Groups',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/groups/picker?maxResults=5',
        filename: 'jira/get-groups.json',
    },
    {
        name: 'Get My Permissions',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/mypermissions?permissions=BROWSE_PROJECTS,CREATE_ISSUES,EDIT_ISSUES,ADMINISTER',
        filename: 'jira/get-permissions.json',
    },
    {
        name: 'Get Project Components',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/project/{projectKey}/components',
        filename: 'jira/get-components.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            return `/rest/api/3/project/${projectKey}/components`;
        },
    },
    {
        name: 'Get Project Versions',
        product: 'jira',
        method: 'GET',
        path: '/rest/api/3/project/{projectKey}/versions',
        filename: 'jira/get-versions.json',
        resolvePath: async (client) => {
            const projectKey = await client.getFirstProjectKey();
            return `/rest/api/3/project/${projectKey}/versions`;
        },
    },
];
const SANITIZE_PATTERNS = [
    // Account IDs (Atlassian account ID format)
    { pattern: /\b[0-9a-f]{24}\b/g, replacement: 'test-account-id' },
    { pattern: /\b[0-9]{1,3}:[0-9a-f-]{36}\b/g, replacement: '0:test-account-uuid' },
    // Cloud IDs (UUID format)
    { pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, replacement: 'test-uuid' },
    // Email addresses
    { pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, replacement: 'user@example.com' },
    // Atlassian site URLs
    { pattern: /https:\/\/[a-zA-Z0-9-]+\.atlassian\.net/g, replacement: 'https://test-site.atlassian.net' },
    // Avatar/image URLs
    { pattern: /https:\/\/[^\s"]+\/avatar[^\s"]*/g, replacement: 'https://test-site.atlassian.net/avatar/default' },
];
/**
 * Sanitize a response body by replacing real data with generic placeholders.
 */
function sanitizeResponse(body) {
    if (body === null || body === undefined)
        return body;
    if (typeof body === 'string') {
        let result = body;
        for (const { pattern, replacement } of SANITIZE_PATTERNS) {
            result = result.replace(new RegExp(pattern.source, pattern.flags), replacement);
        }
        return result;
    }
    if (Array.isArray(body)) {
        // Keep only the first element as representative
        if (body.length === 0)
            return [];
        return [sanitizeResponse(body[0])];
    }
    if (typeof body === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(body)) {
            result[key] = sanitizeResponse(value);
        }
        return result;
    }
    return body;
}
/**
 * Capture API responses from a real Atlassian site.
 */
async function captureAPIResponses(options) {
    const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
    (0, fs_1.mkdirSync)(outputDir, { recursive: true });
    const client = new SiteClient(options.siteUrl, options.email, options.apiToken);
    let apis = exports.COMMON_APIS;
    if (options.product) {
        apis = apis.filter((a) => a.product === options.product);
    }
    const results = [];
    for (const api of apis) {
        try {
            console.log(`Capturing ${api.name} (${api.method} ${api.path})...`);
            const resolvedPath = api.resolvePath
                ? await api.resolvePath(client)
                : api.path;
            const { status, body } = await client.request(api.method, resolvedPath);
            if (status >= 400) {
                console.warn(`  ⚠️  Got ${status} — saving error response`);
            }
            const sanitizedBody = sanitizeResponse(body);
            const bodyKeys = typeof sanitizedBody === 'object' && sanitizedBody !== null && !Array.isArray(sanitizedBody)
                ? Object.keys(sanitizedBody)
                : [];
            const captured = {
                _endpoint: api.path,
                _method: api.method,
                _product: api.product,
                _capturedAt: new Date().toISOString(),
                _notes: 'Sanitized — real IDs/names replaced with placeholders. Arrays truncated to first element.',
                status,
                body: sanitizedBody,
                bodyKeys,
            };
            const filePath = (0, path_1.join)(outputDir, api.filename);
            // Ensure subdirectory exists (filenames are like 'jira/get-issue.json')
            (0, fs_1.mkdirSync)((0, path_1.join)(filePath, '..'), { recursive: true });
            (0, fs_1.writeFileSync)(filePath, JSON.stringify(captured, null, 2) + '\n');
            console.log(`  ✅ Saved to ${filePath}`);
            results.push({ definition: api, success: true, filePath });
        }
        catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            console.error(`  ❌ Failed: ${error}`);
            results.push({ definition: api, success: false, error });
        }
    }
    return results;
}
// CLI entry point
if (process.argv[1]?.endsWith('capture-api-responses.ts') || process.argv[1]?.endsWith('capture-api-responses.js')) {
    const args = process.argv.slice(2);
    function getArg(name) {
        const idx = args.indexOf(`--${name}`);
        return idx >= 0 ? args[idx + 1] : undefined;
    }
    const siteUrl = getArg('site-url');
    const email = getArg('email');
    const apiToken = getArg('api-token');
    if (!siteUrl || !email || !apiToken) {
        console.error('Usage: npx tsx capture-api-responses.ts --site-url <url> --email <email> --api-token <token>');
        process.exit(1);
    }
    const options = {
        siteUrl,
        email,
        apiToken,
        outputDir: getArg('output-dir'),
        product: getArg('product'),
    };
    captureAPIResponses(options).then((results) => {
        const succeeded = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`\nDone: ${succeeded} captured, ${failed} failed`);
        if (failed > 0)
            process.exit(1);
    });
}
