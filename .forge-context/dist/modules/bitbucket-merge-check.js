"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:mergeCheck',
    createBase: () => ({
        workspace: {
            uuid: "{cc8e193d-7603-4dfd-8771-fcc8960aa0fb}"
        },
        repository: {
            uuid: "{15a31549-1cff-45dc-9d0d-310114c5038b}"
        },
        pullrequest: {
            id: 123
        },
        trigger: {
            type: 'on-code-pushed'
        },
        mergeProperties: {
            commitMessage: "Merged in testbranch (pull request #5)\\n\\ntesting PR\\n\\n",
            commitMessageTruncated: false,
            mergeStrategy: "merge_commit",
            closeSourceBranch: false
        },
        type: 'bitbucket:mergeCheck',
    }),
    scenarios: {
        codeQualityCheck: base => ({ ...base, trigger: { ...base.trigger, type: "on-code-pushed" } }),
        reviewApprovalCheck: base => ({ ...base, trigger: { ...base.trigger, type: "on-reviewer-status-changed" } }),
        mergeTimeRestriction: base => ({ ...base, trigger: { ...base.trigger, type: "on-merge" }, mergeProperties: { ...base.mergeProperties, mergeStrategy: "merge_commit", closeSourceBranch: true } })
    }
};
