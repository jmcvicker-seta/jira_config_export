"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:sprintAction',
    createBase: () => ({
        type: 'jira:sprintAction',
        project: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
        },
        board: {
            id: 'sample',
            type: 'simple',
        },
        sprint: {
            id: 'sample',
            state: 'active',
        },
        location: 'https://example.atlassian.net',
        extension: {
            action: 'sample',
        },
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        sprintActionInActiveSprint: (base) => ({ ...base, sprint: { ...(base.sprint || {}), state: "active" }, board: { ...(base.board || {}), type: "scrum" } }),
        sprintActionInFutureSprint: (base) => ({ ...base, sprint: { ...(base.sprint || {}), state: "future" }, board: { ...(base.board || {}), type: "scrum" } }),
        nestedActionTriggered: (base) => ({ ...base, extension: { ...(base.extension || {}), action: "action_1" } }),
    }
};
