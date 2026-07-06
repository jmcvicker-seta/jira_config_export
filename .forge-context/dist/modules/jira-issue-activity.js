"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueActivity',
    createBase: () => ({
        type: 'jira:issueActivity',
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
        bugReportActivity: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug" }, project: { ...(base.project || {}), type: "software" } }),
        featureDevelopmentActivity: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story" }, project: { ...(base.project || {}), type: "software" } }),
        serviceManagementActivity: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Incident" }, project: { ...(base.project || {}), type: "service_management" } }),
    }
};
