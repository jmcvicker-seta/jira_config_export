"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueViewBackgroundScript',
    createBase: () => ({
        type: 'jira:issueViewBackgroundScript',
        issue: {
            id: "10001",
            key: "PROJ-123",
            type: "Bug",
            typeId: "10004",
        },
        project: {
            id: "10000",
            key: "PROJ",
            type: "software",
        },
        location: "https://example.atlassian.net/browse/PROJ-123",
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        bugReport: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug", key: "PROJ-456" }, project: { ...(base.project || {}), type: "software" } }),
        featureDevelopment: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story", key: "PROJ-789" }, project: { ...(base.project || {}), type: "software" } }),
    }
};
