/**
 * Type definitions for WorkflowPostFunctionContext
 */
export interface WorkflowPostFunctionContext {
    issue: {
        id: string;
        key: string;
    };
    comment?: {
        id?: string;
    };
    changelog?: {
        id?: string;
    };
    extension?: {
        postFunctionConfig?: Record<string, unknown>;
        isNewEditor?: boolean;
    };
    type: 'jira:workflowPostFunction';
}
