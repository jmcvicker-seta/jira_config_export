import { ModuleDefinition } from '../types/module-definition.js';
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
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalRequestCreatePropertyPanel', PortalRequestCreatePropertyPanelContext>;
