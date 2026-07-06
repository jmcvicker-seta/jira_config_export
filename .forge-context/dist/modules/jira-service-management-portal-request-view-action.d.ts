import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalRequestViewActionContext {
    type: 'jiraServiceManagement:portalRequestViewAction';
    portal?: {
        id?: number;
    };
    request?: {
        key?: string;
        typeId?: number;
    };
    location?: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalRequestViewAction', PortalRequestViewActionContext>;
