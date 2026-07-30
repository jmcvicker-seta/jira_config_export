import { ModuleDefinition } from '../types/module-definition.js';
export interface IssueContextContext {
    type: 'jira:issueContext';
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
    cloudId: string;
}
export declare const definition: ModuleDefinition<'jira:issueContext', IssueContextContext>;
