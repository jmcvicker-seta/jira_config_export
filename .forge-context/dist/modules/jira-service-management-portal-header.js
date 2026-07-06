"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalHeader',
    createBase: () => ({
        type: 'jiraServiceManagement:portalHeader',
        page: 'help_center',
        portal: {
            id: 1,
        },
        request: {
            typeId: 1,
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        portalPageRendering: (base) => ({ ...base, page: "portal" }),
        requestViewPageRendering: (base) => ({ ...base, page: "view_request", request: { ...(base.request || {}), key: "PROJ-123" } }),
        createRequestPageRendering: (base) => ({ ...base, page: "create_request" }),
    }
};
