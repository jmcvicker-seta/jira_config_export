import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoCodeOverviewActionContext {
    type: 'bitbucket:repoCodeOverviewAction';
    repository: Record<string, unknown>;
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoCodeOverviewAction', RepoCodeOverviewActionContext>;
