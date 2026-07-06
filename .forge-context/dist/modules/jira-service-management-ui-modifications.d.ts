import { ModuleDefinition } from '../types/module-definition.js';
export interface UiModificationsContext {
    extension: {
        type: 'jira:uiModifications';
        portalId: {
            id: string;
        };
        request: {
            typeId: string;
        };
        viewType: 'JSMRequestCreate';
    };
    type: 'jira:uiModifications';
}
export declare const definition: ModuleDefinition<'jira:uiModifications', UiModificationsContext>;
