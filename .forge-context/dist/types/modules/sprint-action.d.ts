/**
 * Type definitions for SprintActionContext
 */
export interface SprintActionContext {
    type: 'jira:sprintAction';
    project: {
        id: string;
        key: string;
        type: string;
    };
    board: {
        id: string;
        type: string;
    };
    sprint: {
        id: string;
        state: string;
    };
    location: string;
}
