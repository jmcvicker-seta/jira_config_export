/**
 * Type definitions for BackgroundScriptContext
 */
export interface BackgroundScriptContext {
    type: 'confluence:backgroundScript';
    content?: {
        id?: string;
        type?: string;
        subtype?: string;
    };
    space?: {
        id?: string;
        key?: string;
    };
    location: string;
}
