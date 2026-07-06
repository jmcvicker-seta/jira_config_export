import { ModuleDefinition } from '../types/module-definition.js';
export interface ProjectSettingsMenuPageContext {
    type: 'bitbucket:projectSettingsMenuPage';
    project: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:projectSettingsMenuPage', ProjectSettingsMenuPageContext>;
