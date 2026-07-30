/**
 * Type definitions for SpaceSettingsContext
 */
export interface SpaceSettingsContext {
    type: 'confluence:spaceSettings';
    space: {
        id: string;
        key: string;
    };
    location: string;
}
