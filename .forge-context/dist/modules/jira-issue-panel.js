"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issuePanel',
    createBase: () => ({
        type: 'jira:issuePanel',
        issue: {
            id: "10001",
            key: "PROJ-123",
            type: "Bug",
            typeId: "10001",
        },
        project: {
            id: "10000",
            key: "PROJ",
            type: "software",
        },
        isNewToIssue: false,
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        panelAddedToBugIssue: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug", typeId: "10001" }, isNewToIssue: true }),
        panelAddedToFeatureRequest: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story", typeId: "10002" }, isNewToIssue: true }),
        multiplePanelInstances: (base) => ({ ...base, isNewToIssue: false }),
    }
};
