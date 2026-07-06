/**
 * Type definitions for PortalRequestViewActionContext
 */
export interface PortalRequestViewActionContext {
    type: 'jiraServiceManagement:portalRequestViewAction';
    portal: {
        id: number;
    };
    request: {
        key: string;
        typeId: number;
    };
    location: string;
}
