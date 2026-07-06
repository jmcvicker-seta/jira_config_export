import { ModuleDefinition } from '../types/module-definition.js';
export interface SpacePageContext {
    type: 'confluence:spacePage';
    space: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:spacePage', SpacePageContext>;
