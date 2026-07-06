import { ModuleDefinition } from '../types/module-definition.js';
export interface WorkflowConditionContext {
    user: Record<string, unknown>;
    issue: Record<string, unknown>;
    project: Record<string, unknown>;
    transition: Record<string, unknown>;
    workflow: Record<string, unknown>;
    config?: Record<string, unknown>;
    groupOperator?: 'AND' | 'OR' | 'null';
    customerRequest?: Record<string, unknown>;
    serviceDesk?: Record<string, unknown>;
    extension?: {
        conditionConfig?: Record<string, unknown>;
        isNewEditor?: boolean;
        workflowId?: string;
        scopedProjectId?: string;
    };
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
    type: 'jira:workflowCondition';
}
export declare const definition: ModuleDefinition<'jira:workflowCondition', WorkflowConditionContext>;
