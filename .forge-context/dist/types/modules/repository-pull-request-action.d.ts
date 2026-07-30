/**
 * Type definitions for RepoPullRequestActionContext
 */
export interface RepoPullRequestActionContext {
    type: 'bitbucket:repoPullRequestAction';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
