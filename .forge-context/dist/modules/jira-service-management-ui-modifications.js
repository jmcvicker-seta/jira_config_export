"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:uiModifications',
    createBase: () => ({
        extension: {
            type: 'jira:uiModifications',
            portalId: {
                id: 'sample',
            },
            request: {
                typeId: 'sample',
            },
            viewType: 'JSMRequestCreate',
        },
        type: 'jira:uiModifications',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        jSMRequestCreatePortal: (base) => ({ ...base, extension: { ...(base.extension || {}), viewType: "JSMRequestCreate" } }),
    }
};
