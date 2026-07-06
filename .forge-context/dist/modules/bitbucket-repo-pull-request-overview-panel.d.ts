import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoPullRequestOverviewPanelContext {
    type: 'bitbucket:repoPullRequestOverviewPanel';
    repository: Record<string, unknown>;
    pullRequest: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoPullRequestOverviewPanel', RepoPullRequestOverviewPanelContext>;
