/**
 * Type definitions for ProjectSettingsPageContext
 */
export interface ProjectSettingsPageContext {
    type: 'jira:projectSettingsPage';
    project: {
        id: string;
        key: string;
        type: string;
    };
    location: string;
}
