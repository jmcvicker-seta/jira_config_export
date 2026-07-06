import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoPullRequestActionContext {
    type: 'bitbucket:repoPullRequestAction';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoPullRequestAction', RepoPullRequestActionContext>;
