"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:uiModifications',
    createBase: () => ({
        extension: {
            type: 'jira:uiModifications',
            project: {
                id: 'sample',
                key: 'sample',
                type: 'sample',
            },
            issueType: {
                id: 'sample',
                name: 'sample',
            },
            viewType: 'GIC',
        },
        type: 'jira:uiModifications',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        globalIssueCreate: (base) => ({ ...base, extension: { ...(base.extension || {}), viewType: "GIC" } }),
        issueView: (base) => ({ ...base, extension: { ...(base.extension || {}), viewType: "ISSUE_VIEW" } }),
        issueTransition: (base) => ({ ...base, extension: { ...(base.extension || {}), viewType: "ISSUE_TRANSITION" } }),
    }
};
