/**
 * Type definitions for MergeCheckContext
 */
export interface MergeCheckContext {
    workspace: {
        uuid: string;
    };
    repository: {
        uuid: string;
    };
    pullrequest: {
        id: number;
    };
    trigger: {
        type: 'on-code-pushed' | 'on-reviewer-status-changed' | 'on-merge';
    };
    mergeProperties?: {
        commitMessage?: string;
        commitMessageTruncated?: boolean;
        mergeStrategy?: string;
        closeSourceBranch?: boolean;
    };
    type: 'bitbucket:mergeCheck';
}
