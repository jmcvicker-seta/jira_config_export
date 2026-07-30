/**
 * Type definitions for RepoSettingsMenuPageContext
 */
export interface RepoSettingsMenuPageContext {
    type: 'bitbucket:repoSettingsMenuPage';
    repository: {
        uuid: string;
    };
    location: string;
}
