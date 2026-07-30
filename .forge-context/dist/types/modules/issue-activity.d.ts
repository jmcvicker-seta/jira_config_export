/**
 * Type definitions for IssueActivityContext
 */
export interface IssueActivityContext {
    type: 'jira:issueActivity';
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
