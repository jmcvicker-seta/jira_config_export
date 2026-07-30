import { ModuleDefinition } from '../types/module-definition.js';
export interface SpaceSettingsContext {
    type: 'confluence:spaceSettings';
    space: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:spaceSettings', SpaceSettingsContext>;
