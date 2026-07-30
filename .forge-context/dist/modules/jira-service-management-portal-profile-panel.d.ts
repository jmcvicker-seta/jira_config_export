import { ModuleDefinition } from '../types/module-definition.js';
export interface PortalProfilePanelContext {
    type: 'jiraServiceManagement:portalProfilePanel';
    page: string;
    location: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:portalProfilePanel', PortalProfilePanelContext>;
