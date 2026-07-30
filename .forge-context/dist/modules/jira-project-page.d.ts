import { ModuleDefinition } from '../types/module-definition.js';
export interface ProjectPageContext {
    type: 'jira:projectPage';
    project: {
        id: string;
        key: string;
        type: string;
    };
    board?: {
        id?: string;
        type?: 'simple' | 'scrum' | 'kanban';
    };
    location: string;
}
export declare const definition: ModuleDefinition<'jira:projectPage', ProjectPageContext>;
