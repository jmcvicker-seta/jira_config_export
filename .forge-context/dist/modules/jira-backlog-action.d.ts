import { ModuleDefinition } from '../types/module-definition.js';
export interface BacklogActionContext {
    type: 'jira:backlogAction';
    project?: {
        id?: string;
        key?: string;
        type?: string;
    };
    board?: {
        id?: string;
        type?: 'simple' | 'scrum' | 'kanban';
    };
    location?: string;
    extension?: {
        action?: string;
    };
}
export declare const definition: ModuleDefinition<'jira:backlogAction', BacklogActionContext>;
