"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'action',
    createBase: () => ({
        extension: {
            data: {
                inputs: {},
            },
            errors: {
                invalidInputs: {},
            },
        },
        payload: {
            projectKey: "CP",
            issueKey: "CP-16",
            comment: "hello world",
        },
        type: 'action',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        addCommentToIssue: (base) => ({ ...base, payload: { ...(base.payload || {}), projectKey: "PROJ", issueKey: "PROJ-123", comment: "Automated comment" } }),
        logTimeAgainstIssue: (base) => ({ ...base, payload: { ...(base.payload || {}), issueKey: "PROJ-456", timesheetDate: "2025-06-10", time: 120 } }),
        actionWithValidationErrors: (base) => ({ ...base, extension: { ...(base.extension || {}), errors: { ...(base.extension?.errors || {}), invalidInputs: { ...(base.extension?.errors.invalidInputs || {}), issueKey: { ...(base.extension?.errors.invalidInputs.issueKey || {}), message: "issueKey is required" }, comment: { ...(base.extension?.errors.invalidInputs.comment || {}), message: "comment is required" } } } } }),
    }
};
