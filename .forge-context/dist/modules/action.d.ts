import { ModuleDefinition } from '../types/module-definition.js';
export interface ActionContext {
    extension?: {
        data: {
            inputs: Record<string, unknown>;
        };
        errors?: {
            invalidInputs?: Record<string, unknown>;
        };
    };
    payload?: {
        projectKey?: string;
        issueKey?: string;
        comment?: string;
    };
    type: 'action';
}
export declare const definition: ModuleDefinition<'action', ActionContext>;
