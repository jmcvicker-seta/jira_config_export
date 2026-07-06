"use strict";
/**
 * Parses a Forge manifest.yml into a typed ManifestConfig.
 *
 * Handles the various manifest shapes (module types, entity definitions,
 * index types) and returns a clean, typed object.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseManifest = parseManifest;
exports.parseManifestFile = parseManifestFile;
const fs_1 = require("fs");
const yaml_1 = require("yaml");
/** Known top-level manifest keys that are NOT module type definitions */
const RESERVED_KEYS = new Set([
    'app',
    'function',
    'resources',
    'permissions',
    'connectModules',
    'providers',
]);
/**
 * Parse a manifest YAML string into a ManifestConfig.
 */
function parseManifest(yamlContent) {
    const raw = (0, yaml_1.parse)(yamlContent);
    if (!raw || typeof raw !== 'object') {
        throw new Error('Invalid manifest: expected a YAML object at the top level');
    }
    return {
        appId: parseAppId(raw),
        runtime: parseRuntime(raw),
        modules: parseModules(raw),
        functions: parseFunctions(raw),
        resources: parseResources(raw),
        entities: parseEntities(raw),
        permissions: parsePermissions(raw),
    };
}
/**
 * Parse a manifest from a file path.
 */
function parseManifestFile(filePath) {
    const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
    return parseManifest(content);
}
function parseAppId(raw) {
    const app = raw['app'];
    return app?.['id'] ?? '';
}
function parseRuntime(raw) {
    const app = raw['app'];
    const runtime = app?.['runtime'];
    return runtime?.['name'];
}
function parseModules(raw) {
    const modules = [];
    const modulesBlock = raw['modules'];
    if (!modulesBlock || typeof modulesBlock !== 'object')
        return modules;
    for (const [typeKey, entries] of Object.entries(modulesBlock)) {
        if (RESERVED_KEYS.has(typeKey))
            continue;
        // Module type keys contain a colon, e.g. "jira:globalPage"
        // The "function" key inside modules is handled separately
        if (typeKey === 'function')
            continue;
        if (!Array.isArray(entries))
            continue;
        for (const entry of entries) {
            if (!entry || typeof entry !== 'object')
                continue;
            const entryObj = entry;
            const resolver = entryObj['resolver'];
            let resolverFunction;
            if (typeof resolver === 'object' && resolver !== null) {
                resolverFunction = resolver['function'];
            }
            else if (typeof resolver === 'string') {
                resolverFunction = resolver;
            }
            modules.push({
                type: typeKey,
                key: entryObj['key'],
                resource: entryObj['resource'],
                resolver: resolverFunction,
                function: entryObj['function'],
                title: entryObj['title'],
                render: entryObj['render'],
                properties: entryObj,
            });
        }
    }
    return modules;
}
function parseFunctions(raw) {
    // Functions can be at top level or inside modules block
    let functionEntries = raw['function'];
    if (!functionEntries) {
        const modulesBlock = raw['modules'];
        functionEntries = modulesBlock?.['function'];
    }
    if (!Array.isArray(functionEntries))
        return [];
    return functionEntries
        .filter((entry) => entry !== null && typeof entry === 'object')
        .map((entry) => ({
        key: entry['key'],
        handler: entry['handler'],
    }));
}
function parseResources(raw) {
    const entries = raw['resources'];
    if (!Array.isArray(entries))
        return [];
    return entries
        .filter((entry) => entry !== null && typeof entry === 'object')
        .map((entry) => ({
        key: entry['key'],
        path: entry['path'],
    }));
}
function parseEntities(raw) {
    const app = raw['app'];
    const storage = app?.['storage'];
    const entities = storage?.['entities'];
    if (!Array.isArray(entities))
        return [];
    return entities
        .filter((entry) => entry !== null && typeof entry === 'object')
        .map(parseEntityDefinition);
}
function parseEntityDefinition(raw) {
    const name = raw['name'];
    // Parse attributes
    const rawAttrs = raw['attributes'];
    const attributes = [];
    if (rawAttrs && typeof rawAttrs === 'object') {
        for (const [attrName, attrDef] of Object.entries(rawAttrs)) {
            const def = attrDef;
            attributes.push({
                name: attrName,
                type: def['type'] ?? 'any',
            });
        }
    }
    // Parse indexes
    const rawIndexes = raw['indexes'];
    const indexes = [];
    if (Array.isArray(rawIndexes)) {
        for (const idx of rawIndexes) {
            if (typeof idx === 'string') {
                // Simple index: just an attribute name
                indexes.push({ kind: 'simple', attribute: idx });
            }
            else if (idx && typeof idx === 'object') {
                // Named index with name, range, partition
                const idxObj = idx;
                indexes.push({
                    kind: 'named',
                    name: idxObj['name'],
                    range: asStringArray(idxObj['range']),
                    partition: idxObj['partition'] ? asStringArray(idxObj['partition']) : undefined,
                });
            }
        }
    }
    return { name, attributes, indexes };
}
function asStringArray(value) {
    if (Array.isArray(value))
        return value.map(String);
    if (typeof value === 'string')
        return [value];
    return [];
}
function parsePermissions(raw) {
    const perms = raw['permissions'];
    if (!perms)
        return { scopes: [] };
    const scopes = Array.isArray(perms['scopes']) ? perms['scopes'] : [];
    let external;
    const rawExternal = perms['external'];
    if (rawExternal) {
        const rawFetch = rawExternal['fetch'];
        if (rawFetch) {
            external = {
                fetch: {
                    backend: Array.isArray(rawFetch['backend']) ? rawFetch['backend'] : [],
                },
            };
        }
    }
    return { scopes, external };
}
