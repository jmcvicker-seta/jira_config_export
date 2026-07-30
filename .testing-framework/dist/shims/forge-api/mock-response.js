"use strict";
/**
 * Mock API response matching the shape returned by @forge/api's
 * requestJira, requestConfluence, etc.
 *
 * The real Forge API response is a subset of the Fetch API Response,
 * with json(), text(), and arrayBuffer() methods.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = createMockResponse;
const DEFAULT_STATUS_TEXTS = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
};
/**
 * Create a mock API response from a fixture response.
 */
function createMockResponse(fixture) {
    // Safety net: warn if the fixture looks malformed (e.g. a raw number was stored as the response)
    if (fixture === null || fixture === undefined || typeof fixture !== 'object' || !('status' in fixture)) {
        console.warn(`[forge-testing-framework] createMockResponse received an invalid fixture: ${String(fixture)}. ` +
            `Expected an object with { status, body }. ` +
            `This usually means addFixture was called with the wrong argument shape. ` +
            `Correct usage: harness.addFixture('GET', '/path', { status: 200, body: { ... } })`);
    }
    const status = fixture.status;
    const statusText = fixture.statusText ?? DEFAULT_STATUS_TEXTS[status] ?? '';
    const ok = status >= 200 && status < 300;
    const headers = new Headers(fixture.headers ?? {});
    if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
    }
    const bodyString = typeof fixture.body === 'string' ? fixture.body : JSON.stringify(fixture.body);
    return {
        ok,
        status,
        statusText,
        headers,
        json: async () => {
            if (typeof fixture.body === 'string') {
                return JSON.parse(fixture.body);
            }
            return fixture.body;
        },
        text: async () => bodyString,
        arrayBuffer: async () => new TextEncoder().encode(bodyString).buffer,
    };
}
