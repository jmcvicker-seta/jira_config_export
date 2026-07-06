/**
 * Type definitions for RepoPullRequestOverviewPanelContext
 */
export interface RepoPullRequestOverviewPanelContext {
    type: 'bitbucket:repoPullRequestOverviewPanel';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
