"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalRequestDetail',
    createBase: () => ({
        type: 'jiraServiceManagement:portalRequestDetail',
        portal: {
            id: 1,
        },
        request: {
            key: 'sample',
            typeId: 1,
            property: {},
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayCustomPanelOnPortalRequest: (base) => ({ ...base, title: "Custom Request Details", viewportSize: "medium" }),
        accessRequestContextData: (base) => ({ ...base, render: "native" }),
    }
};
