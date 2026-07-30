/**
 * Type definitions for PortalRequestCreatePropertyPanelContext
 */
export interface PortalRequestCreatePropertyPanelContext {
    type: 'jiraServiceManagement:portalRequestCreatePropertyPanel';
    portal: {
        id: number;
    };
    request: {
        typeId: number;
    };
    location: string;
}
