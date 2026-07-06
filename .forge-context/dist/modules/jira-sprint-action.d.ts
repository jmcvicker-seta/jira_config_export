import { ModuleDefinition } from '../types/module-definition.js';
export interface SprintActionContext {
    type: 'jira:sprintAction';
    project: {
        id: string;
        key: string;
        type: string;
    };
    board: {
        id: string;
        type: 'simple' | 'scrum' | 'kanban';
    };
    sprint: {
        id: string;
        state: 'active' | 'future';
    };
    location: string;
    extension?: {
        action?: string;
    };
}
export declare const definition: ModuleDefinition<'jira:sprintAction', SprintActionContext>;
