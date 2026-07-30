import { ModuleDefinition } from '../types/module-definition.js';
export interface RepoCodeFileViewerContext {
    type: 'bitbucket:repoCodeFileViewer';
    repository: Record<string, unknown>;
    file: {
        path: string;
    };
    commit: {
        hash: string;
    };
    location: string;
}
export declare const definition: ModuleDefinition<'bitbucket:repoCodeFileViewer', RepoCodeFileViewerContext>;
