"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:boardAction',
    createBase: () => ({
        type: 'jira:boardAction',
        project: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
        },
        board: {
            id: 'sample',
            type: 'simple',
        },
        sprints: [{ "id": "1", "state": "active" }],
        location: 'https://example.atlassian.net',
        extension: {
            action: 'sample',
        },
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        simpleBoardAction: (base) => ({ ...base, board: { ...(base.board || {}), type: "kanban" }, project: { ...(base.project || {}), type: "software" } }),
        boardActionWithNestedActions: (base) => ({ ...base, board: { ...(base.board || {}), type: "scrum" }, extension: { ...(base.extension || {}), action: "action_1" } }),
        boardActionWithSprints: (base) => ({ ...base, board: { ...(base.board || {}), type: "scrum" }, sprints: [{ "id": "1", "state": "active" }] }),
    }
};
