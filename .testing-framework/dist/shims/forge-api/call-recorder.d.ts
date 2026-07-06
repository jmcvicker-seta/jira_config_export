/**
 * Records all API calls made through the fake @forge/api for test assertions.
 */
/** A recorded API call */
export interface RecordedApiCall {
    product: 'jira' | 'confluence' | 'bitbucket' | 'external';
    method: string;
    path: string;
    body?: unknown;
    headers?: Record<string, string>;
    mode: 'asApp' | 'asUser';
    timestamp: number;
}
/**
 * Records API calls for later assertion in tests.
 */
export declare class CallRecorder {
    private calls;
    record(call: RecordedApiCall): void;
    /**
     * Get all recorded calls, optionally filtered.
     */
    getCalls(filter?: {
        product?: string;
        method?: string;
        path?: string;
    }): RecordedApiCall[];
    /**
     * Clear all recorded calls. Call between tests.
     */
    reset(): void;
}
