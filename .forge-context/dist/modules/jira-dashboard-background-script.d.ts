import { ModuleDefinition } from '../types/module-definition.js';
export interface DashboardBackgroundScriptContext {
    type: 'jira:dashboardBackgroundScript';
    location: string;
}
export declare const definition: ModuleDefinition<'jira:dashboardBackgroundScript', DashboardBackgroundScriptContext>;
