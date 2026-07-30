import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalFooterContext {
    type: 'jiraServiceManagement:portalFooter';
    page?: 'help_center' | 'portal' | 'create_request' | 'view_request' | 'approvals' | 'profile' | 'my_requests';
    portal?: {
        id?: number;
    };
    request?: {
        typeId?: number;
        key?: string;
    };
    location?: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalFooter', PortalFooterContext>;
