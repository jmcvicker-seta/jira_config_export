import { ModuleDefinition } from '../types/module-definition.js';
export interface AdminPageContext {
    type: 'jira:adminPage';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:adminPage', AdminPageContext>;
