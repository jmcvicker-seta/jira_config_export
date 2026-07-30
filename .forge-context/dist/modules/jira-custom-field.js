"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:customField',
    createBase: () => ({
        type: 'jira:customField',
        entryPoint: 'edit',
        fieldId: 'sample',
        fieldType: 'sample',
        fieldValue: 'string',
        issue: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
            typeId: 'sample',
        },
        project: {
            id: 'sample',
            key: 'sample',
            type: 'business',
        },
        renderContext: 'issue-view',
        experience: 'issue-view',
        issueTransition: {
            id: 'sample',
        },
        portal: {
            id: 1,
        },
        request: {
            typeId: 1,
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        viewModeOnIssue: (base) => ({ ...base, entryPoint: "view", renderContext: "issue-view", experience: "issue-view" }),
        editModeOnIssueCreate: (base) => ({ ...base, entryPoint: "edit", renderContext: "issue-create", experience: "issue-create" }),
        portalRequestEdit: (base) => ({ ...base, entryPoint: "edit", renderContext: "portal-request", experience: "portal-request", project: { ...(base.project || {}), type: "service_desk" } }),
    }
};
