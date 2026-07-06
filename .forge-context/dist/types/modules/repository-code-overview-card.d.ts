/**
 * Type definitions for RepoCodeOverviewCardContext
 */
export interface RepoCodeOverviewCardContext {
    type: 'bitbucket:repoCodeOverviewCard';
    repository: Record<string, unknown>;
    location: string;
}
