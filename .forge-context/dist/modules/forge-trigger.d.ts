import { ModuleDefinition } from '../types/module-definition.js';
export interface TriggerContext {
    principal?: Record<string, unknown>;
    installContext: string;
    workspaceId?: string;
    license?: Record<string, unknown>;
    installation?: Record<string, unknown>;
    event: Record<string, unknown>;
    type: 'forge:trigger';
}
export declare const definition: ModuleDefinition<'forge:trigger', TriggerContext>;
