"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.PartialSuccessError = exports.InvocationLimitReachedError = exports.InvalidQueueNameError = exports.PayloadTooBigError = exports.TooManyEventsError = exports.RateLimitError = void 0;
exports.getAllPushedEvents = getAllPushedEvents;
exports.getPushedEvents = getPushedEvents;
exports.resetForgeEventsShim = resetForgeEventsShim;
// --- Error types matching @forge/events ---
class RateLimitError extends Error {
    constructor(message = 'Rate limit exceeded') {
        super(message);
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
class TooManyEventsError extends Error {
    constructor(message = 'Too many events in a single push (max 50)') {
        super(message);
        this.name = 'TooManyEventsError';
    }
}
exports.TooManyEventsError = TooManyEventsError;
class PayloadTooBigError extends Error {
    constructor(message = 'Combined payload exceeds 200 KB') {
        super(message);
        this.name = 'PayloadTooBigError';
    }
}
exports.PayloadTooBigError = PayloadTooBigError;
class InvalidQueueNameError extends Error {
    constructor(message = 'Invalid queue name') {
        super(message);
        this.name = 'InvalidQueueNameError';
    }
}
exports.InvalidQueueNameError = InvalidQueueNameError;
class InvocationLimitReachedError extends Error {
    constructor(message = 'Invocation limit reached (max 1000 chained pushes)') {
        super(message);
        this.name = 'InvocationLimitReachedError';
    }
}
exports.InvocationLimitReachedError = InvocationLimitReachedError;
class PartialSuccessError extends Error {
    failedEvents;
    constructor(failedEvents) {
        super('Some events failed to push');
        this.name = 'PartialSuccessError';
        this.failedEvents = failedEvents;
    }
}
exports.PartialSuccessError = PartialSuccessError;
// --- Global event store for test assertions ---
const _allPushedEvents = [];
const _jobStats = new Map();
let _jobCounter = 0;
// --- Queue class ---
class Queue {
    key;
    constructor(options) {
        if (!options.key || !/^[a-zA-Z0-9_][a-zA-Z0-9_-]*$/.test(options.key)) {
            throw new InvalidQueueNameError(`Invalid queue name: '${options.key}'`);
        }
        this.key = options.key;
    }
    /**
     * Push events to the queue to be processed later.
     */
    async push(eventOrEvents) {
        const events = Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents];
        if (events.length > 50) {
            throw new TooManyEventsError();
        }
        const jobId = `job-${++_jobCounter}`;
        const timestamp = Date.now();
        for (const event of events) {
            _allPushedEvents.push({
                ...event,
                queueKey: this.key,
                jobId,
                timestamp,
            });
        }
        _jobStats.set(jobId, { total: events.length, cancelled: false });
        return { jobId };
    }
    /**
     * Get a job by ID for tracking progress.
     */
    getJob(jobId) {
        return new JobProgress(jobId);
    }
}
exports.Queue = Queue;
class JobProgress {
    jobId;
    constructor(jobId) {
        this.jobId = jobId;
    }
    async getStats() {
        const stats = _jobStats.get(this.jobId);
        if (!stats) {
            return { success: 0, inProgress: 0, failed: 0 };
        }
        // In the fake, all events are immediately "successful"
        return {
            success: stats.cancelled ? 0 : stats.total,
            inProgress: 0,
            failed: stats.cancelled ? stats.total : 0,
        };
    }
    async cancel() {
        const stats = _jobStats.get(this.jobId);
        if (stats) {
            stats.cancelled = true;
        }
    }
}
// --- Test utilities ---
/**
 * Get all events pushed to any queue (for test assertions).
 */
function getAllPushedEvents() {
    return [..._allPushedEvents];
}
/**
 * Get events pushed to a specific queue.
 */
function getPushedEvents(queueKey) {
    return _allPushedEvents.filter((e) => e.queueKey === queueKey);
}
/**
 * Reset all pushed events and job state. Call between tests.
 */
function resetForgeEventsShim() {
    _allPushedEvents.length = 0;
    _jobStats.clear();
    _jobCounter = 0;
}
