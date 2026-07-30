import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalUserMenuActionContext {
    type: 'jiraServiceManagement:portalUserMenuAction';
    location: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalUserMenuAction', PortalUserMenuActionContext>;
