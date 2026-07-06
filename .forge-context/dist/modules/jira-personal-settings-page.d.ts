import { ModuleDefinition } from '../types/module-definition.js';
export interface PersonalSettingsPageContext {
    type: 'jira:personalSettingsPage';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:personalSettingsPage', PersonalSettingsPageContext>;
