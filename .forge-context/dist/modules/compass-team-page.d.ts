import { ModuleDefinition } from '../types/module-definition.js';
export interface TeamPageContext {
    type: 'compass:teamPage';
    teamId: string;
}
export declare const definition: ModuleDefinition<'compass:teamPage', TeamPageContext>;
