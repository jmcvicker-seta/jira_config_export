import { ModuleDefinition } from '../types/module-definition.js';
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
    location?: string;
}
export declare const definition: ModuleDefinition<'jira:issueActivity', IssueActivityContext>;
