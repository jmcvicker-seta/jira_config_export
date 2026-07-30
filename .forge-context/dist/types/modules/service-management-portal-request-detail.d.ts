/**
 * Type definitions for PortalRequestDetailContext
 */
export interface PortalRequestDetailContext {
    type: 'jiraServiceManagement:portalRequestDetail';
    portal: {
        id: number;
    };
    request: {
        key: string;
        typeId: number;
        property?: Record<string, unknown>;
    };
    location: string;
}
