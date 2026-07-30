import { ESLintUtils } from '@typescript-eslint/utils';
import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { findManifestPath } from '../manifest-utils.js';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/manifest-reference/permissions/');
const STORAGE_SCOPE = 'storage:app';
/**
 * Module-level cache for storage scope lookups, keyed by manifest path.
 * Avoids redundant I/O when multiple files in the same project share a manifest.
 * Mirrors the caching pattern in manifest-utils.ts.
 */
const storageScopeCache = new Map();
/**
 * Clear the storage scope cache. Exposed for tests.
 */
export function clearStorageScopeCacheForTests() {
    storageScopeCache.clear();
}
/**
 * Check whether the manifest at `manifestPath` declares the `storage:app` scope.
 *
 * Scopes can be declared in two forms:
 *   - Simple: `scopes: ['storage:app', ...]`
 *   - Object (with allowImpersonation): `scopes: { 'storage:app': { ... } }`
 *
 * Returns `true` if the scope is present, `false` if missing.
 * Returns `null` if the manifest can't be read or parsed (caller should not report).
 *
 * Results are cached per manifest path for the duration of the lint run.
 */
export function hasStorageScope(manifestPath) {
    if (storageScopeCache.has(manifestPath)) {
        return storageScopeCache.get(manifestPath);
    }
    let result;
    try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = parseYaml(content);
        const scopes = manifest?.permissions?.scopes;
        if (scopes == null) {
            result = false;
        }
        else if (Array.isArray(scopes)) {
            // Array form: ['storage:app', 'read:jira-work', ...]
            result = scopes.includes(STORAGE_SCOPE);
        }
        else if (typeof scopes === 'object') {
            // Object form: { 'storage:app': { allowImpersonation: true }, ... }
            result = STORAGE_SCOPE in scopes;
        }
        else {
            result = false;
        }
    }
    catch {
        // Can't read/parse manifest — degrade gracefully, don't crash the linter
        result = null;
    }
    storageScopeCache.set(manifestPath, result);
    return result;
}
/**
 * Find the default import identifier for `@forge/api` in the program.
 * Returns the local name (e.g. `api`) or null if not found.
 */
function findForgeApiDefaultImportName(program) {
    for (const stmt of program.body) {
        if (stmt.type === 'ImportDeclaration' &&
            stmt.source.value === '@forge/api') {
            for (const specifier of stmt.specifiers) {
                if (specifier.type === 'ImportDefaultSpecifier') {
                    return specifier.local.name;
                }
            }
        }
    }
    return null;
}
/**
 * Detect storage API imports (`@forge/kvs` or `storage` from `@forge/api`)
 * and verify that the manifest declares `storage:app` in permissions.scopes.
 *
 * This catches a common runtime failure where apps build and deploy fine but
 * throw HTTP 500 "Request principal is not authorized to use storage resource"
 * on every storage call because the scope was never declared.
 */
export const requireStorageScope = createRule({
    name: 'require-storage-scope',
    meta: {
        type: 'problem',
        docs: {
            description: 'Require storage:app scope in manifest.yml when storage APIs (@forge/kvs or storage from @forge/api) are imported',
        },
        messages: {
            missingStorageScope: 'This file imports a storage API ({{ source }}) but `storage:app` is not declared in ' +
                'manifest.yml → permissions.scopes. Without it the Forge runtime returns HTTP 500: ' +
                '"Request principal is not authorized to use storage resource". ' +
                'Fix: add `- storage:app` under `permissions.scopes` in manifest.yml.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        // Cache manifest lookup result per file
        let checkedManifest = false;
        let scopePresent = null;
        function checkManifest() {
            if (checkedManifest)
                return scopePresent;
            checkedManifest = true;
            const filename = context.filename ?? context.getFilename();
            const manifestPath = findManifestPath(path.dirname(filename));
            if (!manifestPath) {
                // No manifest found — can't validate, don't crash
                scopePresent = null;
                return scopePresent;
            }
            scopePresent = hasStorageScope(manifestPath);
            return scopePresent;
        }
        function reportIfMissing(node, source) {
            const result = checkManifest();
            // null = can't determine (no manifest or parse error) — don't report
            if (result === null || result === true)
                return;
            context.report({
                node,
                messageId: 'missingStorageScope',
                data: { source },
            });
        }
        // Track whether we already reported for this file to avoid duplicate errors
        // from multiple detection paths (e.g. `import { storage } from '@forge/api'`
        // would also match `.storage` member access).
        let reported = false;
        function reportOnce(node, source) {
            if (reported)
                return;
            reportIfMissing(node, source);
            reported = true;
        }
        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                // import { kvs } from '@forge/kvs'  OR  import kvs from '@forge/kvs'
                // Any import from @forge/kvs implies storage usage
                if (source === '@forge/kvs') {
                    reportOnce(node, '@forge/kvs');
                    return;
                }
                // import { storage } from '@forge/api'
                if (source === '@forge/api') {
                    for (const specifier of node.specifiers) {
                        if (specifier.type === 'ImportSpecifier' &&
                            specifier.imported.type === 'Identifier' &&
                            specifier.imported.name === 'storage') {
                            reportOnce(node, 'storage from @forge/api');
                            return;
                        }
                    }
                }
            },
            MemberExpression(node) {
                if (reported)
                    return;
                if (node.property.type !== 'Identifier' ||
                    node.property.name !== 'storage') {
                    return;
                }
                const sourceCode = context.sourceCode ?? context.getSourceCode();
                const program = sourceCode.ast;
                const forgeApiName = findForgeApiDefaultImportName(program);
                if (!forgeApiName)
                    return;
                // Pattern 1: api.storage.get(...)
                if (node.object.type === 'Identifier' &&
                    node.object.name === forgeApiName) {
                    reportOnce(node, '@forge/api .storage access');
                    return;
                }
                // Pattern 2: api.asApp().storage.get(...) or api.asUser().storage.get(...)
                if (node.object.type === 'CallExpression' &&
                    node.object.callee.type === 'MemberExpression' &&
                    node.object.callee.property.type === 'Identifier' &&
                    (node.object.callee.property.name === 'asApp' ||
                        node.object.callee.property.name === 'asUser') &&
                    node.object.callee.object.type === 'Identifier' &&
                    node.object.callee.object.name === forgeApiName) {
                    reportOnce(node, '@forge/api .storage access');
                }
            },
        };
    },
});
