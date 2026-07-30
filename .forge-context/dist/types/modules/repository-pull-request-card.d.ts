/**
 * Type definitions for RepoPullRequestCardContext
 */
export interface RepoPullRequestCardContext {
    type: 'bitbucket:repoPullRequestCard';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
