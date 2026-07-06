"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:workflowCondition',
    createBase: () => ({
        user: {},
        issue: {
            id: 'sample',
            key: 'SAMPLE-1',
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
        groupOperator: 'AND',
        customerRequest: {},
        serviceDesk: {},
        extension: {
            conditionConfig: {},
            isNewEditor: false,
            workflowId: 'sample',
            scopedProjectId: 'sample',
        },
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
        type: 'jira:workflowCondition',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        companymanagedProjectCondition: (base) => ({ ...base, projectTypes: ["company-managed"] }),
        teammanagedProjectWithConfiguration: (base) => ({ ...base, projectTypes: ["team-managed"], create: true, edit: true, view: true }),
        serviceDeskTransitionCondition: (base) => ({ ...base, customerRequest: true, serviceDesk: true }),
    }
};
