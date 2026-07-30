import { ModuleDefinition } from '../types/module-definition.js';
export interface ContextMenuContext {
    type: 'confluence:contextMenu';
    selectedText: string;
    content: {
        id: string;
        type: 'page' | 'blogpost' | 'space';
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:contextMenu', ContextMenuContext>;
