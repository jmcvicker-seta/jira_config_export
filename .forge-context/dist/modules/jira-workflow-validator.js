"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:workflowValidator',
    createBase: () => ({
        user: {},
        issue: {
            id: 'sample',
            key: 'SAMPLE-1',
            type: 'Sample',
            typeId: '1',
        },
        originalIssue: {
            id: 'sample',
            key: 'SAMPLE-ORIG',
            type: 'Sample',
            typeId: '1',
        },
        project: {
            id: '1',
            key: 'SAMPLE',
            type: 'software',
        },
        transition: {},
        workflow: {},
        config: {},
        customerRequest: {},
        serviceDesk: {},
        extension: {
            validatorConfig: {},
            isNewEditor: false,
            workflowId: 'sample',
            scopedProjectId: 'sample',
            transitionContext: {},
        },
        type: 'jira:workflowValidator',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        expressionbasedValidatorWithConfiguration: (base) => ({ ...base, expression: "issue.summary.includes(config['key']) == true", projectTypes: ["company-managed", "team-managed"], create: { ...(base.create || {}), resource: "create-resource" }, edit: { ...(base.edit || {}), resource: "edit-resource" }, view: { ...(base.view || {}), resource: "view-resource" } }),
        lambdaFunctionValidator: (base) => ({ ...base, function: "validate", configuration: { ...(base.configuration || {}), } }),
        dynamicErrorMessageValidator: (base) => ({ ...base, expression: "issue.assignee != null", errorMessage: { ...(base.errorMessage || {}), expression: "'Task must be assigned to ' + config['assignee']" } }),
    }
};
