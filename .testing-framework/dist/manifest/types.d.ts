/**
 * Types representing a parsed Forge manifest.yml
 *
 * These are the framework's internal representation — clean TypeScript types
 * with no YAML quirks leaking through.
 */
/** A single attribute definition within a custom entity */
export interface EntityAttribute {
    name: string;
    type: 'string' | 'integer' | 'float' | 'boolean' | 'any';
}
/** A simple index: just an attribute name */
export interface SimpleIndex {
    kind: 'simple';
    /** The attribute name, also used to reference this index in queries */
    attribute: string;
}
/** A named index with optional partition and required range */
export interface NamedIndex {
    kind: 'named';
    name: string;
    range: string[];
    partition?: string[];
}
export type EntityIndex = SimpleIndex | NamedIndex;
/** A custom entity definition from `app.storage.entities` */
export interface EntityDefinition {
    name: string;
    attributes: EntityAttribute[];
    indexes: EntityIndex[];
}
/** A function definition from `function:` */
export interface FunctionDefinition {
    key: string;
    handler: string;
}
/** A resource definition from `resources:` */
export interface ResourceDefinition {
    key: string;
    path: string;
}
/** A module definition from any `product:moduleType` entry */
export interface ModuleDefinition {
    /** The full module type key, e.g. "jira:globalPage" */
    type: string;
    /** The module key from manifest */
    key: string;
    /** The resource key this module renders */
    resource?: string;
    /** The resolver function key */
    resolver?: string;
    /** The function key (for non-resolver modules) */
    function?: string;
    /** The module title */
    title?: string;
    /** Render mode: 'native' (UI Kit) or 'default' (Custom UI) */
    render?: string;
    /** All other properties from the manifest entry */
    properties: Record<string, unknown>;
}
/** External fetch permissions */
export interface ExternalFetchPermission {
    backend: string[];
}
/** Permissions block from the manifest */
export interface Permissions {
    scopes: string[];
    external?: {
        fetch?: ExternalFetchPermission;
    };
    content?: {
        styles?: string[];
        scripts?: string[];
    };
}
/** The top-level parsed manifest */
export interface ManifestConfig {
    /** App ID (ARI), may be empty for unregistered apps */
    appId: string;
    /** Runtime name, e.g. "nodejs22.x" */
    runtime?: string;
    /** All module definitions, grouped by type */
    modules: ModuleDefinition[];
    /** Function definitions */
    functions: FunctionDefinition[];
    /** Resource definitions */
    resources: ResourceDefinition[];
    /** Custom entity definitions */
    entities: EntityDefinition[];
    /** Permissions */
    permissions: Permissions;
}
