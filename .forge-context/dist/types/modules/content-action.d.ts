/**
 * Type definitions for ContentActionContext
 */
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
