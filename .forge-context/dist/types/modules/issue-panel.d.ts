/**
 * Type definitions for IssuePanelContext
 */
export interface IssuePanelContext {
    type: 'jira:issuePanel';
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
    isNewToIssue: boolean;
    location: string;
}
