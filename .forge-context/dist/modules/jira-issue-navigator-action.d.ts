import { ModuleDefinition } from '../types/module-definition.js';
export interface IssueNavigatorActionContext {
    type: 'jira:issueNavigatorAction';
    filterId: string;
    issueKeys: string[];
    jql: string;
    action?: string;
    location: string;
}
export declare const definition: ModuleDefinition<'jira:issueNavigatorAction', IssueNavigatorActionContext>;
