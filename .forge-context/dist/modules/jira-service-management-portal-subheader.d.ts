import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalSubheaderContext {
    type: 'jiraServiceManagement:portalSubheader';
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
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalSubheader', PortalSubheaderContext>;
