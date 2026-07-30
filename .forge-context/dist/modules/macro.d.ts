import { ModuleDefinition } from '../types/module-definition.js';
export interface MacroContext {
    type: 'macro';
    content: {
        id: string;
        type: 'page' | 'blogpost' | 'space';
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    isEditing: boolean;
    references?: Record<string, unknown>[];
    config?: Record<string, unknown>;
    macro?: {
        body?: Record<string, unknown>;
        isConfiguring?: boolean;
        isInserting?: boolean;
    };
    autoConvertLink?: string;
    template?: {
        id?: string;
    };
}
export declare const definition: ModuleDefinition<'macro', MacroContext>;
