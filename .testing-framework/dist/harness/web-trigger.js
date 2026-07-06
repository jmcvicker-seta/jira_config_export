"use strict";
/**
 * Web Trigger testing support.
 *
 * Provides invokeWebTrigger() to test web trigger handlers with
 * a WebTriggerRequest-shaped input and validate the WebTriggerResponse output.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeWebTrigger = invokeWebTrigger;
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
async function invokeWebTrigger(handler, manifest, moduleKey, request = {}) {
    // Find the web trigger module
    const module = manifest.modules.find((m) => m.key === moduleKey && m.type.includes('webtrigger'));
    const functionKey = module?.function ?? moduleKey;
    const fullRequest = {
        method: request.method ?? 'GET',
        path: request.path ?? '/',
        headers: request.headers ?? {},
        queryParameters: request.queryParameters ?? {},
        body: request.body,
    };
    // Web triggers use a different invocation shape than resolvers.
    // The handler receives { call: { functionKey }, context, payload: request }
    const invokePayload = {
        call: { functionKey },
        context: {},
        payload: fullRequest,
    };
    const result = await handler(invokePayload);
    // Normalise the response
    if (result && typeof result === 'object') {
        const r = result;
        return {
            statusCode: r['statusCode'] ?? r['status'] ?? 200,
            headers: r['headers'],
            body: r['body'],
        };
    }
    return { statusCode: 200, body: String(result) };
}
