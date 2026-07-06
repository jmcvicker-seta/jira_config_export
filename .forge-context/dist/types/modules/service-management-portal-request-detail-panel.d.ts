/**
 * Type definitions for PortalRequestDetailPanelContext
 */
export interface PortalRequestDetailPanelContext {
    type: 'jiraServiceManagement:portalRequestDetailPanel';
    portal: {
        id: number;
    };
    request: {
        key: string;
        typeId: number;
    };
    location: string;
}
