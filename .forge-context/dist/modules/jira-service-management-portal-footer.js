"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalFooter',
    createBase: () => ({
        type: 'jiraServiceManagement:portalFooter',
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
        portalPageFooter: (base) => ({ ...base, page: "portal" }),
        requestViewFooter: (base) => ({ ...base, page: "view_request" }),
        createRequestFooter: (base) => ({ ...base, page: "create_request" }),
    }
};
