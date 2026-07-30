"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:organizationPanel',
    createBase: () => ({
        type: 'jiraServiceManagement:organizationPanel',
        organization: {
            id: 1,
        },
        project: {
            id: 1,
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
};
