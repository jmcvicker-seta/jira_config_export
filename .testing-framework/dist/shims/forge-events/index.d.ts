/**
 * Fake implementation of @forge/events.
 *
 * Provides a Queue class with push() and getJob() methods matching the
 * real @forge/events v2 API surface. Events are stored in-memory for
 * test assertions.
 *
 * Usage in app code (works unchanged with this shim):
 *   import { Queue } from '@forge/events';
 *   const queue = new Queue({ key: 'my-queue' });
 *   await queue.push({ body: { hello: 'world' } });
 */
export type Body = Record<string, unknown>;
export interface Concurrency {
    key: string;
    limit: number;
}
export interface PushEvent {
    body: Body;
    delayInSeconds?: number;
    concurrency?: Concurrency;
}
export interface PushResult {
    jobId: string;
}
export interface JobStats {
    success: number;
    inProgress: number;
    failed: number;
}
export interface RetryContext {
    retryCount: number;
    retryReason: string;
    retryData: unknown;
    retentionWindow?: {
        startTime: string;
        remainingTimeMs: number;
    };
}
export interface AsyncEvent {
    body: Body;
    jobId: string;
    retryContext?: RetryContext;
}
export interface RecordedPushEvent extends PushEvent {
    queueKey: string;
    jobId: string;
    timestamp: number;
}
export declare class RateLimitError extends Error {
    constructor(message?: string);
}
export declare class TooManyEventsError extends Error {
    constructor(message?: string);
}
export declare class PayloadTooBigError extends Error {
    constructor(message?: string);
}
export declare class InvalidQueueNameError extends Error {
    constructor(message?: string);
}
export declare class InvocationLimitReachedError extends Error {
    constructor(message?: string);
}
export declare class PartialSuccessError extends Error {
    readonly failedEvents: Array<{
        event: PushEvent;
        error: string;
    }>;
    constructor(failedEvents: Array<{
        event: PushEvent;
        error: string;
    }>);
}
export declare class Queue {
    readonly key: string;
    constructor(options: {
        key: string;
    });
    /**
     * Push events to the queue to be processed later.
     */
    push(eventOrEvents: PushEvent | PushEvent[]): Promise<PushResult>;
    /**
     * Get a job by ID for tracking progress.
     */
    getJob(jobId: string): JobProgress;
}
declare class JobProgress {
    private readonly jobId;
    constructor(jobId: string);
    getStats(): Promise<JobStats>;
    cancel(): Promise<void>;
}
/**
 * Get all events pushed to any queue (for test assertions).
 */
export declare function getAllPushedEvents(): RecordedPushEvent[];
/**
 * Get events pushed to a specific queue.
 */
export declare function getPushedEvents(queueKey: string): RecordedPushEvent[];
/**
 * Reset all pushed events and job state. Call between tests.
 */
export declare function resetForgeEventsShim(): void;
export {};
