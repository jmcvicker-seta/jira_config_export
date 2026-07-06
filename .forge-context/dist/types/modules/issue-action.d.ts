/**
 * Type definitions for IssueActionContext
 */
export interface IssueActionContext {
    type: 'jira:issueAction';
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
