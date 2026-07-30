"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalUserMenuAction',
    createBase: () => ({
        type: 'jiraServiceManagement:portalUserMenuAction',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        incidentRequest: (base) => ({ ...base, }),
    }
};
