/**
 * Type definitions for BacklogActionContext
 */
export interface BacklogActionContext {
    type: 'jira:backlogAction';
    project: {
        id: string;
        key: string;
        type: string;
    };
    board: {
        id: string;
        type: 'simple' | 'scrum' | 'kanban';
    };
    location: string;
}
