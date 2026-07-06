import { ModuleDefinition } from '../types/module-definition.js';
export interface GlobalBackgroundScriptContext {
    type: 'jira:globalBackgroundScript';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:globalBackgroundScript', GlobalBackgroundScriptContext>;
