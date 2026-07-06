import { ModuleDefinition } from '../types/module-definition.js';
export interface ContentBylineItemContext {
    type: 'confluence:contentBylineItem';
    content: {
        id: string;
        type: 'page' | 'blogpost';
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:contentBylineItem', ContentBylineItemContext>;
