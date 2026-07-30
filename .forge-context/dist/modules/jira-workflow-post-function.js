"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:workflowPostFunction',
    createBase: () => ({
        issue: {
            key: 'sample',
            id: 'sample',
        },
        comment: {
            id: 'sample',
        },
        changelog: {
            id: 'sample',
        },
        extension: {
            postFunctionConfig: {},
            isNewEditor: false,
            workflowId: 'sample',
            scopedProjectId: 'sample',
            transitionContext: {
                id: 'sample',
                from: {
                    id: 'sample',
                    name: 'sample',
                    statusCategory: 'sample',
                },
                to: {
                    id: 'sample',
                    name: 'sample',
                    statusCategory: 'sample',
                },
            },
        },
        type: 'jira:workflowPostFunction',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        updateIssueFieldOnTransition: (base) => ({ ...base, issue: { ...(base.issue || {}), key: "PROJ-123", id: "10000" } }),
        addCommentOnTransition: (base) => ({ ...base, issue: { ...(base.issue || {}), key: "PROJ-456" }, comment: { ...(base.comment || {}), id: "10001" } }),
        processChangelogOnTransition: (base) => ({ ...base, issue: { ...(base.issue || {}), key: "PROJ-789" }, changelog: { ...(base.changelog || {}), id: "10002" } }),
    }
};
