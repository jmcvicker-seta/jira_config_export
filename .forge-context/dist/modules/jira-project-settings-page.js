"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:projectSettingsPage',
    createBase: () => ({
        type: 'jira:projectSettingsPage',
        project: {
            id: "10000",
            key: "PROJ",
            type: "software",
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        softwareProjectSettings: (base) => ({ ...base, project: { ...(base.project || {}), type: "software", key: "SOFT", id: "10001" } }),
        businessProjectSettings: (base) => ({ ...base, project: { ...(base.project || {}), type: "business", key: "BUS", id: "10002" } }),
        serviceManagementProjectSettings: (base) => ({ ...base, project: { ...(base.project || {}), type: "service_desk", key: "SD", id: "10003" } }),
    }
};
