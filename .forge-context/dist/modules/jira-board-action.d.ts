import { ModuleDefinition } from '../types/module-definition.js';
export interface BoardActionContext {
    type: 'jira:boardAction';
    project: {
        id: string;
        key: string;
        type: string;
    };
    board: {
        id: string;
        type: 'simple' | 'scrum' | 'kanban';
    };
    sprints?: Record<string, unknown>[];
    location?: string;
    extension?: {
        action?: string;
    };
}
export declare const definition: ModuleDefinition<'jira:boardAction', BoardActionContext>;
