/**
 * Type definitions for ProjectPageContext
 */
export interface ProjectPageContext {
    type: 'jira:projectPage';
    project: {
        id: string;
        key: string;
        type: string;
    };
    location: string;
}
