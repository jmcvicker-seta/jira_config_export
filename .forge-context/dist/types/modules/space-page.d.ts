/**
 * Type definitions for SpacePageContext
 */
export interface SpacePageContext {
    type: 'confluence:spacePage';
    space: {
        id: string;
        key: string;
    };
    location: string;
}
