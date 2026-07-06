/**
 * Type definitions for RepoMainMenuPageContext
 */
export interface RepoMainMenuPageContext {
    type: 'bitbucket:repoMainMenuPage';
    repository: Record<string, unknown>;
    location: string;
}
