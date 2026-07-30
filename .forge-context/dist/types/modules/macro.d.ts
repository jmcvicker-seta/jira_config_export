/**
 * Type definitions for MacroContext
 */
export interface MacroContext {
    type: 'confluence:macro';
    content: {
        id: string;
        type: string;
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    isEditing: boolean;
    references: Record<string, unknown>[];
    config: Record<string, unknown>;
    macro?: {
        body?: Record<string, unknown>;
        isConfiguring?: boolean;
        isInserting?: boolean;
    };
    autoConvertLink?: string;
}
