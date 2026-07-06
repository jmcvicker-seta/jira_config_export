import { ModuleDefinition } from '../types/module-definition.js';
export interface GlobalSettingsContext {
    type: 'confluence:globalSettings';
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:globalSettings', GlobalSettingsContext>;
