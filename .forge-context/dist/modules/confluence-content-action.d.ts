import { ModuleDefinition } from '../types/module-definition.js';
export interface ContentActionContext {
    type: 'confluence:contentAction';
    content: {
        id: string;
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:contentAction', ContentActionContext>;
