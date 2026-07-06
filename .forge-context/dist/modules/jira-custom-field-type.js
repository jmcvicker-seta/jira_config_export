"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:customFieldType',
    createBase: () => ({
        type: 'jira:customFieldType',
        entryPoint: 'edit',
        fieldId: "customfield_10020",
        fieldType: "ari:cloud:ecosystem::extension/4211172c-5e6b-4170-9fce-f3314107517e/3b0cdefc-4f24-4696-a7dd-1092d95637f9/static/module-key",
        fieldValue: 'string',
        issue: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
            typeId: 'sample'
        },
        project: {
            id: 'sample',
            key: 'sample',
            type: 'business'
        },
        renderContext: 'issue-view',
        experience: 'issue-view',
        configurationId: 1,
        configuration: {},
        fieldContextId: 1,
        issueTransition: {
            id: 'sample'
        },
        portal: {
            id: 1
        },
        request: {
            typeId: 1
        },
    }),
    scenarios: {
        viewMode: base => ({ ...base, entryPoint: "view", renderContext: "issue-view" }),
        editMode: base => ({ ...base, entryPoint: "edit", renderContext: "issue-view" }),
        portalRequest: base => ({ ...base, entryPoint: "edit", renderContext: "portal-request" })
    }
};
