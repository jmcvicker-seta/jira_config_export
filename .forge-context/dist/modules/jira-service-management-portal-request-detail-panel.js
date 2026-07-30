"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalRequestDetailPanel',
    createBase: () => ({
        type: 'jiraServiceManagement:portalRequestDetailPanel',
        portal: {
            id: 1,
        },
        request: {
            key: "SD-123",
            typeId: 1,
        },
        location: "https://example.atlassian.net/servicedesk/customer/portal/1/SD-123",
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        customerSupportPanel: (base) => ({ ...base, title: "Customer Support Tools", viewportSize: "medium" }),
        incidentTracking: (base) => ({ ...base, title: "Incident Tracking", viewportSize: "large" }),
        requestAnalytics: (base) => ({ ...base, title: "Request Analytics", viewportSize: "small" }),
    }
};
