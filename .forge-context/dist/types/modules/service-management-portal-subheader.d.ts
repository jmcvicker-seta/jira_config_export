/**
 * Type definitions for PortalSubheaderContext
 */
export interface PortalSubheaderContext {
    type: 'jiraServiceManagement:portalSubheader';
    page: string;
    portal?: {
        id?: number;
    };
    request?: {
        typeId?: number;
        key?: string;
    };
    location: string;
}
