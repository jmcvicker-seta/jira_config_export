import { ModuleDefinition } from '../types/module-definition.js';
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
    location?: string;
}
export declare const definition: ModuleDefinition<'jira:issueAction', IssueActionContext>;
