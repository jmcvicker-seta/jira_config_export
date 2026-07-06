/**
 * Web Trigger testing support.
 *
 * Provides invokeWebTrigger() to test web trigger handlers with
 * a WebTriggerRequest-shaped input and validate the WebTriggerResponse output.
 */
import type { ManifestConfig } from '../manifest/types.js';
/** The request shape passed to a Forge web trigger handler */
export interface WebTriggerRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    path: string;
    headers: Record<string, string[]>;
    queryParameters: Record<string, string[]>;
    body?: string;
}
/** The response shape returned by a Forge web trigger handler */
export interface WebTriggerResponse {
    statusCode: number;
    headers?: Record<string, string[]>;
    body?: string;
}
/**
 * Invoke a web trigger handler function.
 *
 * Looks up the web trigger function from the manifest by module key,
 * then calls it with the WebTriggerRequest shape.
 *
 * @param handler - The app's exported handler function
 * @param manifest - The parsed manifest
 * @param moduleKey - The web trigger module key from the manifest
 * @param request - The incoming request
 */
export declare function invokeWebTrigger(handler: (payload: unknown) => Promise<unknown>, manifest: ManifestConfig, moduleKey: string, request?: Partial<WebTriggerRequest>): Promise<WebTriggerResponse>;
