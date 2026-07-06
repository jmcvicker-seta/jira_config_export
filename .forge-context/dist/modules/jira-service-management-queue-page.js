"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:queuePage',
    createBase: () => ({
        type: 'jiraServiceManagement:queuePage',
        project: {
            id: 'sample',
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        queueManagement: (base) => ({ ...base, project: { ...(base.project || {}), key: "SUPPORT", id: "10001" }, location: "https://example.atlassian.net/jira/servicedesk/projects/SUPPORT/queues/apps/app-id/env-id" }),
        incidentTracking: (base) => ({ ...base, project: { ...(base.project || {}), key: "INC", id: "10002" }, location: "https://example.atlassian.net/jira/servicedesk/projects/INC/queues/apps/app-id/env-id" }),
    }
};
