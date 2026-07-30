import { ModuleDefinition } from '../types/module-definition.js';
export interface QueuePageContext {
    type: 'jiraServiceManagement:queuePage';
    project: {
        id: string;
        key: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'jiraServiceManagement:queuePage', QueuePageContext>;
