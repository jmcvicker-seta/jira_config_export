/**
 * Type definitions for WorkflowConditionContext
 */
export interface WorkflowConditionContext {
    user: Record<string, unknown>;
    issue: Record<string, unknown>;
    project: Record<string, unknown>;
    transition: Record<string, unknown>;
    workflow: Record<string, unknown>;
    config?: Record<string, unknown>;
    groupOperator?: string;
    customerRequest?: Record<string, unknown>;
    serviceDesk?: Record<string, unknown>;
    extension?: {
        conditionConfig?: Record<string, unknown>;
        isNewEditor?: boolean;
    };
    type: 'jira:workflowCondition';
}
