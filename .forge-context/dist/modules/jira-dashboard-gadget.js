"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:dashboardGadget',
    createBase: () => ({
        gadgetConfiguration: {},
        dashboard: {
            id: 'sample',
        },
        gadget: {
            id: 'sample',
        },
        extension: {
            entryPoint: 'edit',
        },
        type: 'jira:dashboardGadget',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        viewMode: (base) => ({ ...base, extension: { ...(base.extension || {}), entryPoint: "view" } }),
        editMode: (base) => ({ ...base, extension: { ...(base.extension || {}), entryPoint: "edit" } }),
        autorefresh: (base) => ({ ...base, refreshable: true }),
    }
};
