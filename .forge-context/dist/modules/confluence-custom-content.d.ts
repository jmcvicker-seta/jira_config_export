import { ModuleDefinition } from '../types/module-definition.js';
export interface CustomContentContext {
    type: 'confluence:customContent';
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:customContent', CustomContentContext>;
