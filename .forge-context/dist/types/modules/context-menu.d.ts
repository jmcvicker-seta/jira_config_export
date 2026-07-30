/**
 * Type definitions for ContextMenuContext
 */
export interface ContextMenuContext {
    type: 'confluence:contextMenu';
    selectedText: string;
    content: {
        id: string;
        type: string;
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    location: string;
}
