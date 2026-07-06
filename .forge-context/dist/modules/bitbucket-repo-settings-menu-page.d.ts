import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoSettingsMenuPageContext {
    type: 'bitbucket:repoSettingsMenuPage';
    repository: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoSettingsMenuPage', RepoSettingsMenuPageContext>;
