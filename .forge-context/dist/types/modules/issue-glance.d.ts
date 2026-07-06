/**
 * Type definitions for IssueGlanceContext
 */
export interface IssueGlanceContext {
    type: 'jira:issueGlance';
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
}
