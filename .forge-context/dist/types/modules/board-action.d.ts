/**
 * Type definitions for BoardActionContext
 */
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
    sprints: Record<string, unknown>[];
    location: string;
}
