import { ModuleDefinition } from '../types/module-definition.js';
export interface WorkspaceGlobalPageContext {
    type: 'bitbucket:workspaceGlobalPage';
    workspace: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:workspaceGlobalPage', WorkspaceGlobalPageContext>;
