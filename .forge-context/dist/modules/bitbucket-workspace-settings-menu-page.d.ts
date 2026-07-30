import { ModuleDefinition } from '../types/module-definition.js';
export interface WorkspaceSettingsMenuPageContext {
    type: 'bitbucket:workspaceSettingsMenuPage';
    workspace: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:workspaceSettingsMenuPage', WorkspaceSettingsMenuPageContext>;
