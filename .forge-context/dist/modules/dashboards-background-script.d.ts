import { ModuleDefinition } from '../types/module-definition.js';
export interface BackgroundScriptContext {
    key: string;
    resource: string;
    render: 'native';
    type: 'dashboards:backgroundScript';
}
export declare const definition: ModuleDefinition<'dashboards:backgroundScript', BackgroundScriptContext>;
