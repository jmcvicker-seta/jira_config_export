/**
 * Type definitions for PortalHeaderContext
 */
export interface PortalHeaderContext {
    type: 'jiraServiceManagement:portalHeader';
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
