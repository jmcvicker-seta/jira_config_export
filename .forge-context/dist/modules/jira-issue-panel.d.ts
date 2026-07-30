import { ModuleDefinition } from '../types/module-definition.js';
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
    location?: string;
}
export declare const definition: ModuleDefinition<'jira:issuePanel', IssuePanelContext>;
