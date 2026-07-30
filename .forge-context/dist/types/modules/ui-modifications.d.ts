/**
 * Type definitions for UiModificationsContext
 */
export interface UiModificationsContext {
    extension: {
        type: string;
        project: {
            id: string;
            key: string;
            type: string;
        };
        issueType: {
            id: string;
            name: string;
        };
        viewType: string;
        issue?: {
            id?: string;
            key?: string;
        };
        issueTransition?: {
            id?: string;
        };
    };
    type: 'jira:uiModifications';
}
