/**
 * Type definitions for IssueContextContext
 */
export interface IssueContextContext {
    type: 'jira:issueContext';
    issue: {
        id: string;
        key: string;
        type: string;
        typeId: string;
    };
    project: {
        id: string;
        key: string;
        type: string;
    };
    location: string;
}
