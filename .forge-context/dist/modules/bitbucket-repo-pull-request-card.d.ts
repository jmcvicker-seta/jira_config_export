import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoPullRequestCardContext {
    type: 'bitbucket:repoPullRequestCard';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoPullRequestCard', RepoPullRequestCardContext>;
