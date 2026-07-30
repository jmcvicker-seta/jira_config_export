"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueContext',
    createBase: () => ({
        type: 'jira:issueContext',
        issue: {
            id: "10001",
            key: "PROJ-123",
            type: "Bug",
            typeId: "10001",
        },
        project: {
            id: "10000",
            key: "PROJ",
            type: "software",
        },
        location: 'https://example.atlassian.net',
        cloudId: 'sample',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        bugReport: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug", key: "PROJ-456" } }),
        featureDevelopment: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story", key: "PROJ-789" } }),
        dynamicStatusUpdate: (base) => ({ ...base, status: { ...(base.status || {}), type: "lozenge", value: { ...(base.status?.value || {}), type: "moved" } } }),
    }
};
