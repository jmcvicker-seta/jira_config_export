import { ModuleDefinition } from '../types/module-definition.js';
export interface AssetsImportTypeContext {
    type: 'jiraServiceManagement:assetsImportType';
    importId: string;
    workspaceId: string;
    schemaId: string;
    location: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:assetsImportType', AssetsImportTypeContext>;
