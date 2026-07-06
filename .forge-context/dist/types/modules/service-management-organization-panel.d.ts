/**
 * Type definitions for OrganizationPanelContext
 */
export interface OrganizationPanelContext {
    type: 'jiraServiceManagement:organizationPanel';
    organization: {
        id: string;
    };
    project: {
        id: string;
        key: string;
    };
    location: string;
}
