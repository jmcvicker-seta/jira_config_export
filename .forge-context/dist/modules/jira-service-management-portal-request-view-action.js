"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalRequestViewAction',
    createBase: () => ({
        type: 'jiraServiceManagement:portalRequestViewAction',
        portal: {
            id: 1,
        },
        request: {
            key: 'sample',
            typeId: 1,
        },
        location: 'https://example.atlassian.net',
    }),
};
