/**
 * Type definitions for PortalFooterContext
 */
export interface PortalFooterContext {
    type: 'jiraServiceManagement:portalFooter';
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
