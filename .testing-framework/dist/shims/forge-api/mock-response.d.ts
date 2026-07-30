/**
 * Mock API response matching the shape returned by @forge/api's
 * requestJira, requestConfluence, etc.
 *
 * The real Forge API response is a subset of the Fetch API Response,
 * with json(), text(), and arrayBuffer() methods.
 */
import type { FixtureResponse } from '../../fixtures/types.js';
/** Matches the response shape from @forge/api product request methods */
export interface MockApiResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
    json(): Promise<unknown>;
    text(): Promise<string>;
    arrayBuffer(): Promise<ArrayBuffer>;
}
/**
 * Create a mock API response from a fixture response.
 */
export declare function createMockResponse(fixture: FixtureResponse): MockApiResponse;
