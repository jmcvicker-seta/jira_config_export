import { ModuleDefinition } from '../types/module-definition.js';
export interface HomepageFeedContext {
    type: 'confluence:homepageFeed';
    location: string;
}
export declare const definition: ModuleDefinition<'confluence:homepageFeed', HomepageFeedContext>;
