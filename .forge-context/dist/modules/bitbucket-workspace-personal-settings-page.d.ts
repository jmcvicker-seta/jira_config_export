import { ModuleDefinition } from '../types/module-definition.js';
export interface WorkspacePersonalSettingsPageContext {
    type: 'bitbucket:workspacePersonalSettingsPage';
    workspace: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:workspacePersonalSettingsPage', WorkspacePersonalSettingsPageContext>;
