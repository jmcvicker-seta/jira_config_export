"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueNavigatorAction',
    createBase: () => ({
        type: 'jira:issueNavigatorAction',
        filterId: 'sample',
        issueKeys: [],
        jql: 'sample',
        action: 'sample',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        singleActionExecution: (base) => ({ ...base, action: null }),
        nestedActionSelection: (base) => ({ ...base, action: "action_1" }),
        multipleIssuesSelected: (base) => ({ ...base, issueKeys: ["PROJ-1", "PROJ-2", "PROJ-3"] }),
    }
};
