import { ModuleDefinition } from '../types/module-definition.js';
export interface UiModificationsContext {
    extension: {
        type: 'jira:uiModifications';
        project: {
            id: string;
            key: string;
            type: string;
        };
        issueType: {
            id: string;
            name: string;
        };
        viewType: 'GIC' | 'ISSUE_VIEW' | 'ISSUE_TRANSITION';
    };
    type: 'jira:uiModifications';
}
export declare const definition: ModuleDefinition<'jira:uiModifications', UiModificationsContext>;
