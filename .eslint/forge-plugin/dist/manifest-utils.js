/**
 * Shared helpers for ESLint rules that need to know about the Forge manifest.yml
 * that owns the currently-linted file.
 *
 * Used by:
 *   - require-forge-reconciler: enforce render()/addConfig() on entry points
 *   - confluence-macro-config-allowed-components: only enforce restricted
 *     component set on confluence:macro.config entry points (NOT on
 *     automation:action.config, jira:customField config, etc.)
 */
import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
const MANIFEST_FILENAME = 'manifest.yml';
const FRONTEND_DIR = 'src/frontend';
const manifestCache = new Map();
const manifestLookupCache = new Map();
/**
 * Walk up from `startDir` to find manifest.yml. Returns null if not found.
 */
export function findManifestPath(startDir) {
    if (manifestLookupCache.has(startDir)) {
        return manifestLookupCache.get(startDir);
    }
    let dir = startDir;
    const root = path.parse(dir).root;
    while (dir !== root) {
        const candidate = path.join(dir, MANIFEST_FILENAME);
        if (fs.existsSync(candidate)) {
            manifestLookupCache.set(startDir, candidate);
            return candidate;
        }
        dir = path.dirname(dir);
    }
    manifestLookupCache.set(startDir, null);
    return null;
}
/**
 * Parse manifest.yml and return a Map from absolute entry-point path to the
 * list of (moduleType, role) usages in the manifest.
 */
export function getManifestEntryPoints(manifestPath) {
    if (manifestCache.has(manifestPath)) {
        return manifestCache.get(manifestPath);
    }
    const byPath = new Map();
    try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = parseYaml(content);
        // Build resource key → absolute path for resources in the frontend directory
        const resources = manifest?.resources;
        const resourcePaths = new Map(); // key → absolute path
        if (Array.isArray(resources)) {
            const manifestDir = path.dirname(manifestPath);
            for (const resource of resources) {
                if (typeof resource?.key === 'string' && typeof resource?.path === 'string') {
                    const normalised = path.normalize(resource.path);
                    if (normalised.startsWith(FRONTEND_DIR + path.sep) ||
                        normalised.startsWith(FRONTEND_DIR + '/')) {
                        resourcePaths.set(resource.key, path.resolve(manifestDir, normalised));
                    }
                }
            }
        }
        const recordUsage = (resourceKey, usage) => {
            if (!resourceKey)
                return;
            const absPath = resourcePaths.get(resourceKey);
            if (!absPath)
                return;
            const existing = byPath.get(absPath) ?? [];
            existing.push(usage);
            byPath.set(absPath, existing);
        };
        // Walk modules and record (moduleType, role) for each resource reference.
        const modules = manifest?.modules ?? {};
        for (const [moduleType, instances] of Object.entries(modules)) {
            if (!Array.isArray(instances))
                continue;
            for (const instance of instances) {
                if (typeof instance?.resource === 'string') {
                    recordUsage(instance.resource, { moduleType, role: 'main' });
                }
                if (instance?.config?.resource && typeof instance.config.resource === 'string') {
                    recordUsage(instance.config.resource, { moduleType, role: 'config' });
                }
            }
        }
    }
    catch {
        // If we can't read/parse the manifest, degrade gracefully — return empty.
    }
    const result = { byPath };
    manifestCache.set(manifestPath, result);
    return result;
}
/**
 * Returns true if `absoluteFilePath` is registered as ANY kind of entry point
 * in the manifest at `manifestPath`.
 */
export function isManifestEntryPoint(manifestPath, absoluteFilePath) {
    return getManifestEntryPoints(manifestPath).byPath.has(absoluteFilePath);
}
/**
 * Returns the list of (moduleType, role) usages for `absoluteFilePath` in the
 * manifest at `manifestPath`. Empty when the file isn't referenced.
 */
export function getEntryPointUsages(manifestPath, absoluteFilePath) {
    return getManifestEntryPoints(manifestPath).byPath.get(absoluteFilePath) ?? [];
}
/**
 * Clear all manifest caches. Exposed for tests.
 */
export function clearManifestCachesForTests() {
    manifestCache.clear();
    manifestLookupCache.clear();
}
