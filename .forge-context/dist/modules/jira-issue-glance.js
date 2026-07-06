"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:issueGlance',
    createBase: () => ({
        type: 'jira:issueGlance',
        issue: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
            typeId: 'sample',
        },
        project: {
            id: 'sample',
            key: 'sample',
            type: 'sample',
        },
        cloudId: 'sample',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayIssueGlanceOnBugReport: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Bug" }, project: { ...(base.project || {}), type: "software" } }),
        displayIssueGlanceOnFeatureRequest: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Story" }, project: { ...(base.project || {}), type: "software" } }),
        displayIssueGlanceOnServiceRequest: (base) => ({ ...base, issue: { ...(base.issue || {}), type: "Incident" }, project: { ...(base.project || {}), type: "service_management" } }),
    }
};
