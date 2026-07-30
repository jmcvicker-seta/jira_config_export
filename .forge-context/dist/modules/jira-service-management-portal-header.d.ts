import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalHeaderContext {
    type: 'jiraServiceManagement:portalHeader';
    page: 'help_center' | 'portal' | 'create_request' | 'view_request' | 'approvals' | 'profile' | 'my_requests';
    portal?: {
        id?: number;
    };
    request?: {
        typeId?: number;
        key?: string;
    };
    location?: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalHeader', PortalHeaderContext>;
