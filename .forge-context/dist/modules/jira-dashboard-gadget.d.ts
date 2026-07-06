import { ModuleDefinition } from '../types/module-definition.js';
export interface DashboardGadgetContext {
    gadgetConfiguration?: Record<string, unknown>;
    dashboard?: {
        id?: string;
    };
    gadget?: {
        id?: string;
    };
    extension?: {
        entryPoint?: 'edit' | 'view';
    };
    type: 'jira:dashboardGadget';
    location?: string;
}
export declare const definition: ModuleDefinition<'jira:dashboardGadget', DashboardGadgetContext>;
