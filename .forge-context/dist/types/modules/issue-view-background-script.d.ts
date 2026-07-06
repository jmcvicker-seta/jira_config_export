/**
 * Type definitions for IssueViewBackgroundScriptContext
 */
export interface IssueViewBackgroundScriptContext {
    type: 'jira:issueViewBackgroundScript';
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
