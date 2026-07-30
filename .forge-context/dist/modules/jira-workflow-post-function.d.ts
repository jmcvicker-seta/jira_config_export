import { ModuleDefinition } from '../types/module-definition.js';
export interface WorkflowPostFunctionContext {
    issue: {
        key: string;
        id: string;
    };
    comment?: Record<string, unknown>;
    changelog?: Record<string, unknown>;
    extension?: {
        postFunctionConfig?: Record<string, unknown>;
        isNewEditor?: boolean;
        workflowId?: string;
        scopedProjectId?: string;
        transitionContext?: {
            id?: string;
            from?: {
                id?: string;
                name?: string;
                statusCategory?: string;
            };
            to?: {
                id?: string;
                name?: string;
                statusCategory?: string;
            };
        };
    };
    type: 'jira:workflowPostFunction';
}
export declare const definition: ModuleDefinition<'jira:workflowPostFunction', WorkflowPostFunctionContext>;
