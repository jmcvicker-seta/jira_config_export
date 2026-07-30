/**
 * Type definitions for RepoCodeOverviewPanelContext
 */
export interface RepoCodeOverviewPanelContext {
    type: 'bitbucket:repoCodeOverviewPanel';
    repository: Record<string, unknown>;
    location: string;
}
