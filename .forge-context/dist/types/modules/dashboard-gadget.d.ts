/**
 * Type definitions for DashboardGadgetContext
 */
export interface DashboardGadgetContext {
    gadgetConfiguration: Record<string, unknown>;
    dashboard: {
        id: string;
    };
    gadget: {
        id: string;
    };
    type: 'jira:dashboardGadget';
    location: string;
    extension: {
        entryPoint: 'edit' | 'view';
    };
}
