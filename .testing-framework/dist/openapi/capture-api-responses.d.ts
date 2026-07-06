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
/** Definition of an API to capture */
export interface APICaptureDefinition {
    /** Human-readable name */
    name: string;
    /** Product (jira or confluence) */
    product: 'jira' | 'confluence';
    /** HTTP method */
    method: string;
    /** API path (may contain {placeholder} segments resolved at runtime) */
    path: string;
    /** Output filename */
    filename: string;
    /**
     * Function to resolve dynamic path segments.
     * Receives the site client and returns the resolved path.
     * If not provided, the path is used as-is.
     */
    resolvePath?: (client: SiteClient) => Promise<string>;
}
/** Captured and sanitized API response */
export interface CapturedResponse {
    _endpoint: string;
    _method: string;
    _product: string;
    _capturedAt: string;
    _notes: string;
    status: number;
    body: unknown;
    bodyKeys: string[];
}
/** Simple HTTP client for an Atlassian site */
export declare class SiteClient {
    private readonly siteUrl;
    private readonly email;
    private readonly apiToken;
    constructor(siteUrl: string, email: string, apiToken: string);
    request(method: string, path: string): Promise<{
        status: number;
        body: unknown;
    }>;
    /** Get the first Jira project key available on the site */
    getFirstProjectKey(): Promise<string>;
    /** Get the first issue key in a project */
    getFirstIssueKey(projectKey: string): Promise<string>;
    /** Get the first Confluence space key */
    getFirstSpaceKey(): Promise<string>;
    /** Get the first page ID in a space */
    getFirstPageId(spaceKey: string): Promise<string>;
    /** Get the first Scrum board ID (for Jira Software / Agile APIs) */
    getFirstBoardId(): Promise<number>;
    /** Get the first sprint ID for a board */
    getFirstSprintId(boardId: number): Promise<number>;
    /** Get the first service desk ID (for JSM APIs) */
    getFirstServiceDeskId(): Promise<string>;
    /** Get the first customer request key (for JSM APIs) */
    getFirstRequestKey(serviceDeskId: string): Promise<string>;
    /** Get the first queue ID for a service desk */
    getFirstQueueId(serviceDeskId: string): Promise<string>;
}
/**
 * The list of common APIs to capture.
 *
 * Based on top Forge module types in production (top_modules_in_prod.csv),
 * these are the APIs most frequently used by Forge apps building on
 * Jira issue panels, global pages, project pages, dashboards, admin pages,
 * and Confluence pages/spaces.
 */
export declare const COMMON_APIS: APICaptureDefinition[];
/**
 * Sanitize a response body by replacing real data with generic placeholders.
 */
export declare function sanitizeResponse(body: unknown): unknown;
/** Options for the capture process */
export interface CaptureOptions {
    siteUrl: string;
    email: string;
    apiToken: string;
    outputDir?: string;
    /** Only capture specific products */
    product?: 'jira' | 'confluence';
}
/** Result of capturing a single API */
export interface CaptureResult {
    definition: APICaptureDefinition;
    success: boolean;
    filePath?: string;
    error?: string;
}
/**
 * Capture API responses from a real Atlassian site.
 */
export declare function captureAPIResponses(options: CaptureOptions): Promise<CaptureResult[]>;
