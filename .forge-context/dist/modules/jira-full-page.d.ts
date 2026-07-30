import { ModuleDefinition } from '../types/module-definition.js';
export interface FullPageContext {
    type: 'jira:fullPage';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:fullPage', FullPageContext>;
