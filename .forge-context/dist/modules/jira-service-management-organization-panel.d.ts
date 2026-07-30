import { ModuleDefinition } from '../types/module-definition.js';
export interface OrganizationPanelContext {
    type: 'jiraServiceManagement:organizationPanel';
    organization: {
        id: number;
    };
    project: {
        id: number;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:organizationPanel', OrganizationPanelContext>;
