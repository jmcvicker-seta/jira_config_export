import { ModuleDefinition } from '../types/module-definition.js';
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
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalRequestDetailPanel', PortalRequestDetailPanelContext>;
