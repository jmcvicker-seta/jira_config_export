"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueAction',
    createBase: () => ({
        type: 'jira:issueAction',
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
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        bugReport: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug" }, project: { ...(base.project || {}), type: "software" } }),
        featureDevelopment: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story" }, project: { ...(base.project || {}), type: "software" } }),
        serviceManagement: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Incident" }, project: { ...(base.project || {}), type: "service_desk" } }),
    }
};
