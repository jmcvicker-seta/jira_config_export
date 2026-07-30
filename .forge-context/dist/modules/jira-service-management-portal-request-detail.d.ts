import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalRequestDetailContext {
    type: 'jiraServiceManagement:portalRequestDetail';
    portal?: {
        id?: number;
    };
    request?: {
        key?: string;
        typeId?: number;
        property?: Record<string, unknown>;
    };
    location?: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalRequestDetail', PortalRequestDetailContext>;
