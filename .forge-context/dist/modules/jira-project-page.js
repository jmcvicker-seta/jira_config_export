"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:projectPage',
    createBase: () => ({
        type: 'jira:projectPage',
        project: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
        },
        board: {
            id: 'sample',
            type: 'simple',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        jiraSoftwareProjectPageWithBoardContext: (base) => ({ ...base, board: { ...(base.board || {}), id: "1", type: "scrum" } }),
        jiraServiceManagementProjectPage: (base) => ({ ...base, project: { ...(base.project || {}), type: "service_desk" } }),
    }
};
