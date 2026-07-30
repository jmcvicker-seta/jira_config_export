"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:backlogAction',
    createBase: () => ({
        type: 'jira:backlogAction',
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
        extension: {
            action: 'sample',
        },
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        simpleBacklogAction: (base) => ({ ...base, key: "hello-world-backlog-action-module", title: "Hello World", icon: "https://developer.atlassian.com/platform/forge/images/icons/issue-panel-icon.svg", viewportSize: "medium" }),
        backlogActionWithNestedActions: (base) => ({ ...base, key: "multi-action-backlog-module", title: "Multi Action", actions: [{ "key": "action_1", "title": "Action 1" }, { "key": "action_2", "title": "Action 2", "tooltip": "tooltip for action 2", "viewportSize": "small" }] }),
        dynamicBacklogAction: (base) => ({ ...base, key: "dynamic-backlog-action", title: "Dynamic Action", actionType: "dynamic" }),
    }
};
