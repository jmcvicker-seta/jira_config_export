/**
 * Type definitions for RepoCodeOverviewActionContext
 */
export interface RepoCodeOverviewActionContext {
    type: 'bitbucket:repoCodeOverviewAction';
    repository: Record<string, unknown>;
    location: string;
}
