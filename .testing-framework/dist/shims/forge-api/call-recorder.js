"use strict";
/**
 * Records all API calls made through the fake @forge/api for test assertions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRecorder = void 0;
/**
 * Records API calls for later assertion in tests.
 */
class CallRecorder {
    calls = [];
    record(call) {
        this.calls.push(call);
    }
    /**
     * Get all recorded calls, optionally filtered.
     */
    getCalls(filter) {
        if (!filter)
            return [...this.calls];
        return this.calls.filter((call) => {
            if (filter.product && call.product !== filter.product)
                return false;
            if (filter.method && call.method !== filter.method.toUpperCase())
                return false;
            if (filter.path && !call.path.includes(filter.path))
                return false;
            return true;
        });
    }
    /**
     * Clear all recorded calls. Call between tests.
     */
    reset() {
        this.calls = [];
    }
}
exports.CallRecorder = CallRecorder;
