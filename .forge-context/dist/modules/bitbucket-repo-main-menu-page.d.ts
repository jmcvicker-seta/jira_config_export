import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoMainMenuPageContext {
    type: 'bitbucket:repoMainMenuPage';
    repository: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoMainMenuPage', RepoMainMenuPageContext>;
