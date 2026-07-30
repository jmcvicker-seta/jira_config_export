import { ModuleDefinition } from '../types/module-definition.js';
export interface WidgetContext {
    key: string;
    title: string;
    description: string;
    thumbnail: string;
    resource: string;
    edit?: Record<string, unknown>;
    render?: 'native';
    resolver?: Record<string, unknown>;
    config?: Record<string, unknown>;
    layout?: Record<string, unknown>;
    widgetId?: string;
    type: 'dashboards:widget';
}
export declare const definition: ModuleDefinition<'dashboards:widget', WidgetContext>;
