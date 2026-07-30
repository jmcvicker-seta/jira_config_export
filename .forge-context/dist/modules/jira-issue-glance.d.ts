import { ModuleDefinition } from '../types/module-definition.js';
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
    cloudId: string;
}
export declare const definition: ModuleDefinition<'jira:issueGlance', IssueGlanceContext>;
