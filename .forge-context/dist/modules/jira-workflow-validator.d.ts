import { ModuleDefinition } from '../types/module-definition.js';
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
        workflowId?: string;
        scopedProjectId?: string;
        transitionContext?: Record<string, unknown>;
    };
    type: 'jira:workflowValidator';
}
export declare const definition: ModuleDefinition<'jira:workflowValidator', WorkflowValidatorContext>;
