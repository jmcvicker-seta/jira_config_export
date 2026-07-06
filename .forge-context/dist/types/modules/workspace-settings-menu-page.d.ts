/**
 * Type definitions for WorkspaceSettingsMenuPageContext
 */
export interface WorkspaceSettingsMenuPageContext {
    type: 'bitbucket:workspaceSettingsMenuPage';
    workspace: Record<string, unknown>;
    location: string;
}
