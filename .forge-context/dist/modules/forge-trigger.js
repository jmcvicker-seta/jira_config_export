"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'forge:trigger',
    createBase: () => ({
        principal: {},
        installContext: 'sample',
        workspaceId: 'sample',
        license: {},
        installation: {},
        event: {},
        type: 'forge:trigger',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        issueUpdatedWithSelfignoreAndExpressionFilter: (base) => ({ ...base, events: ["avi:jira:updated:issue"], filter: { ...(base.filter || {}), ignoreSelf: true, expression: "event.issue.fields?.issueType.name == 'Bug'", onError: "RECEIVE_AND_LOG" } }),
    }
};
