/**
 * Type definitions for IssueNavigatorActionContext
 */
export interface IssueNavigatorActionContext {
    type: 'jira:issueNavigatorAction';
    filterId: string;
    issueKeys: string[];
    jql: string;
    action?: string;
    location: string;
}
