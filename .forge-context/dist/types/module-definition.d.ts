import { DeepPartial } from '../utils.js';
export interface BaseIssue {
    id: string;
    key: string;
    type: string;
    typeId: string;
}
export type ProjectType = 'business' | 'software' | 'product_discovery' | 'service_desk' | 'ops';
export interface BaseProject {
    id: string;
    key: string;
    type: ProjectType;
}
export interface ModuleDefinition<K extends string, C extends {
    type: K;
}> {
    key: K;
    createBase(): C;
    scenarios?: Record<string, (base: C) => C>;
}
export type ExtractContext<D> = D extends ModuleDefinition<string, infer C> ? C : never;
export type ForgeModuleKeyFromDefs<Ds extends ReadonlyArray<ModuleDefinition<string, {
    type: string;
}>>> = Ds[number]['key'];
export type ModuleContextFromDefs<Ds extends ReadonlyArray<ModuleDefinition<string, {
    type: string;
}>>> = ReturnType<Ds[number]['createBase']>;
export type ContextForKey<All extends {
    type: string;
}, K extends string> = Extract<All, {
    type: K;
}>;
export interface ScenarioHelpers {
    createScenarioContext<K extends string, C extends {
        type: K;
    }>(key: K, scenario: string, overrides?: DeepPartial<C>): C;
    listScenarios<K extends string>(key: K): string[];
}
