import { ModuleDefinition } from '../types/module-definition.js';
export interface GlobalPageContext {
    type: 'jira:globalPage';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:globalPage', GlobalPageContext>;
