"use strict";
/**
 * Async Event / Queue testing support.
 *
 * Provides an in-memory event queue that collects events and allows
 * synchronous processing for deterministic testing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventQueue = void 0;
/**
 * In-memory event queue for testing async event handlers.
 *
 * Usage:
 * ```typescript
 * const queue = new EventQueue(handler, manifest);
 *
 * // Push events
 * queue.pushEvent('myQueue', { issueKey: 'TEST-1' });
 * queue.pushEvent('myQueue', { issueKey: 'TEST-2' });
 *
 * // Process all pending events synchronously
 * const results = await queue.processQueue('myQueue');
 *
 * // Or trigger a product event
 * const result = await queue.triggerEvent('avi:jira:created:issue', {
 *   issue: { key: 'TEST-1' }
 * });
 * ```
 */
class EventQueue {
    handler;
    manifest;
    queues = new Map();
    processedEvents = [];
    constructor(handler, manifest) {
        this.handler = handler;
        this.manifest = manifest;
    }
    /**
     * Push an event onto a named queue.
     */
    pushEvent(queue, payload = {}) {
        if (!this.queues.has(queue)) {
            this.queues.set(queue, []);
        }
        this.queues.get(queue).push({
            queue,
            payload,
            timestamp: Date.now(),
        });
    }
    /**
     * Process all pending events on a named queue.
     * Events are processed in FIFO order and removed from the queue.
     */
    async processQueue(queue) {
        const events = this.queues.get(queue) ?? [];
        this.queues.set(queue, []);
        const results = [];
        for (const event of events) {
            const functionKey = this.findFunctionForQueue(queue);
            try {
                const result = await this.handler({
                    call: { functionKey },
                    context: {},
                    payload: event.payload,
                });
                const processedResult = {
                    queue,
                    payload: event.payload,
                    result,
                };
                results.push(processedResult);
                this.processedEvents.push(processedResult);
            }
            catch (err) {
                const processedResult = {
                    queue,
                    payload: event.payload,
                    error: err instanceof Error ? err : new Error(String(err)),
                };
                results.push(processedResult);
                this.processedEvents.push(processedResult);
            }
        }
        return results;
    }
    /**
     * Trigger a product event (e.g. 'avi:jira:created:issue') and process it immediately.
     */
    async triggerEvent(eventType, payload = {}) {
        const functionKey = this.findFunctionForEvent(eventType);
        try {
            const result = await this.handler({
                call: { functionKey },
                context: {},
                payload: { ...payload, eventType },
            });
            const processedResult = {
                queue: eventType,
                payload,
                result,
            };
            this.processedEvents.push(processedResult);
            return processedResult;
        }
        catch (err) {
            const processedResult = {
                queue: eventType,
                payload,
                error: err instanceof Error ? err : new Error(String(err)),
            };
            this.processedEvents.push(processedResult);
            return processedResult;
        }
    }
    /**
     * Get the number of pending events on a queue.
     */
    pendingCount(queue) {
        return this.queues.get(queue)?.length ?? 0;
    }
    /**
     * Get all processed event results.
     */
    getProcessedEvents() {
        return [...this.processedEvents];
    }
    /**
     * Clear all queues and processed event history.
     */
    reset() {
        this.queues.clear();
        this.processedEvents.length = 0;
    }
    findFunctionForQueue(queue) {
        // Look for a consumer module matching the queue name
        const module = this.manifest.modules.find((m) => m.key === queue || m.properties['queue'] === queue);
        return module?.function ?? queue;
    }
    findFunctionForEvent(eventType) {
        // Look for a trigger module matching the event type
        const module = this.manifest.modules.find((m) => {
            const events = m.properties['events'];
            return events?.includes(eventType) || m.key === eventType;
        });
        return module?.function ?? eventType;
    }
}
exports.EventQueue = EventQueue;
