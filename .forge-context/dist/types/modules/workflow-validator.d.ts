/**
 * Type definitions for WorkflowValidatorContext
 */
export interface WorkflowValidatorContext {
    user: Record<string, unknown>;
    issue: Record<string, unknown>;
    originalIssue?: Record<string, unknown>;
    project: Record<string, unknown>;
    transition: Record<string, unknown>;
    workflow: Record<string, unknown>;
    config?: Record<string, unknown>;
    customerRequest?: Record<string, unknown>;
    serviceDesk?: Record<string, unknown>;
    extension?: {
        validatorConfig?: Record<string, unknown>;
        isNewEditor?: boolean;
    };
    type: 'jira:workflowValidator';
}
