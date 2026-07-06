import { ModuleDefinition } from '../types/module-definition.js';
export interface ComponentPageContext {
    type: 'compass:componentPage';
    componentId: string;
}
export declare const definition: ModuleDefinition<'compass:componentPage', ComponentPageContext>;
