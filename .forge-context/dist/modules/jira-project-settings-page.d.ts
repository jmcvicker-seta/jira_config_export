import { ModuleDefinition } from '../types/module-definition.js';
export interface ProjectSettingsPageContext {
    type: 'jira:projectSettingsPage';
    project: {
        id: string;
        key: string;
        type: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'jira:projectSettingsPage', ProjectSettingsPageContext>;
