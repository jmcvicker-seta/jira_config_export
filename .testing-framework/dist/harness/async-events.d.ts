/**
 * Async Event / Queue testing support.
 *
 * Provides an in-memory event queue that collects events and allows
 * synchronous processing for deterministic testing.
 */
import type { ManifestConfig } from '../manifest/types.js';
/** An event waiting to be processed */
export interface QueuedEvent {
    queue: string;
    payload: Record<string, unknown>;
    timestamp: number;
}
/** Result of processing a queued event */
export interface EventProcessingResult {
    queue: string;
    payload: Record<string, unknown>;
    result?: unknown;
    error?: Error;
}
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
export declare class EventQueue {
    private readonly handler;
    private readonly manifest;
    private readonly queues;
    private readonly processedEvents;
    constructor(handler: (payload: unknown) => Promise<unknown>, manifest: ManifestConfig);
    /**
     * Push an event onto a named queue.
     */
    pushEvent(queue: string, payload?: Record<string, unknown>): void;
    /**
     * Process all pending events on a named queue.
     * Events are processed in FIFO order and removed from the queue.
     */
    processQueue(queue: string): Promise<EventProcessingResult[]>;
    /**
     * Trigger a product event (e.g. 'avi:jira:created:issue') and process it immediately.
     */
    triggerEvent(eventType: string, payload?: Record<string, unknown>): Promise<EventProcessingResult>;
    /**
     * Get the number of pending events on a queue.
     */
    pendingCount(queue: string): number;
    /**
     * Get all processed event results.
     */
    getProcessedEvents(): EventProcessingResult[];
    /**
     * Clear all queues and processed event history.
     */
    reset(): void;
    private findFunctionForQueue;
    private findFunctionForEvent;
}
