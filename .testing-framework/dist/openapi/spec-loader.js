"use strict";
/**
 * SpecLoader — loads and queries downloaded OpenAPI v3 specs.
 *
 * Provides:
 * - Loading specs from the local specs/ directory
 * - Resolving $ref references within a spec
 * - Looking up operations by path + method
 * - Extracting resolved request/response schemas
 *
 * This is the foundation for the API catalog, fixture generator, and fixture validator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecLoader = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const spec_sources_js_1 = require("./spec-sources.js");
const _currentDir = typeof __dirname !== 'undefined' ? __dirname : eval("import.meta.dirname");
const DEFAULT_SPECS_DIR = (0, path_1.join)(_currentDir, '../../specs');
class SpecLoader {
    specsDir;
    specCache = new Map();
    constructor(specsDir) {
        this.specsDir = specsDir ?? DEFAULT_SPECS_DIR;
    }
    /**
     * Load the first spec registered for a product (SPEC_SOURCES order — newest API version preferred).
     * Use {@link loadAllByProduct} to load every spec for a product (e.g. v1 + v2).
     */
    loadByProduct(product) {
        const source = spec_sources_js_1.SPEC_SOURCES.find((s) => s.product === product);
        if (!source) {
            throw new Error(`No spec source found for product '${product}'. Available: ${[...new Set(spec_sources_js_1.SPEC_SOURCES.map((s) => s.product))].join(', ')}`);
        }
        return this.loadSpec(source.filename);
    }
    /**
     * Load every spec registered for a product, in SPEC_SOURCES order.
     * Missing spec files are silently skipped — they're downloaded on demand
     * via `yarn download-specs`.
     */
    loadAllByProduct(product) {
        const sources = spec_sources_js_1.SPEC_SOURCES.filter((s) => s.product === product);
        const specs = [];
        for (const source of sources) {
            try {
                specs.push(this.loadSpec(source.filename));
            }
            catch {
            }
        }
        return specs;
    }
    /**
     * Load a spec by filename (e.g. 'jira-platform.v3.json').
     */
    loadSpec(filename) {
        const cached = this.specCache.get(filename);
        if (cached)
            return cached;
        const filePath = (0, path_1.join)(this.specsDir, filename);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new Error(`Spec file '${filename}' not found at ${filePath}. Run 'yarn download-specs' to download OpenAPI specs.`);
        }
        const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
        const spec = JSON.parse(content);
        this.specCache.set(filename, spec);
        return spec;
    }
    /**
     * List all available spec files in the specs directory.
     */
    listAvailableSpecs() {
        if (!(0, fs_1.existsSync)(this.specsDir))
            return [];
        return (0, fs_1.readdirSync)(this.specsDir).filter((f) => f.endsWith('.json'));
    }
    /**
     * Get a resolved operation from a spec.
     */
    getOperation(spec, path, method) {
        const pathItem = spec.paths[path];
        if (!pathItem)
            return undefined;
        const lowerMethod = method.toLowerCase();
        const operation = pathItem[lowerMethod];
        if (!operation)
            return undefined;
        return this.resolveOperation(spec, path, lowerMethod, operation, pathItem);
    }
    /**
     * List all operations in a spec.
     */
    listOperations(spec) {
        const operations = [];
        const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
        for (const [path, pathItem] of Object.entries(spec.paths)) {
            for (const method of httpMethods) {
                const operation = pathItem[method];
                if (operation) {
                    operations.push(this.resolveOperation(spec, path, method, operation, pathItem));
                }
            }
        }
        return operations;
    }
    /**
     * Resolve all $ref references in a schema object.
     * Handles circular references by stopping at a configurable depth.
     */
    resolveRef(spec, obj, maxDepth = 10) {
        return this.resolveRefInternal(spec, obj, maxDepth, 0, new Set());
    }
    resolveRefInternal(spec, obj, maxDepth, depth, visited) {
        if (depth > maxDepth || obj === null || obj === undefined || typeof obj !== 'object') {
            return (obj ?? {});
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.resolveRefInternal(spec, item, maxDepth, depth + 1, visited));
        }
        const record = obj;
        // Resolve $ref
        if ('$ref' in record && typeof record.$ref === 'string') {
            const ref = record.$ref;
            if (visited.has(ref)) {
                return { $circular: ref };
            }
            const resolved = this.lookupRef(spec, ref);
            if (!resolved)
                return { $unresolved: ref };
            return this.resolveRefInternal(spec, resolved, maxDepth, depth + 1, new Set([...visited, ref]));
        }
        // Resolve all nested objects
        const result = {};
        for (const [key, value] of Object.entries(record)) {
            if (typeof value === 'object' && value !== null) {
                result[key] = this.resolveRefInternal(spec, value, maxDepth, depth + 1, visited);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
    lookupRef(spec, ref) {
        // Only handle local refs: #/components/schemas/Foo
        if (!ref.startsWith('#/'))
            return undefined;
        const parts = ref.slice(2).split('/');
        let current = spec;
        for (const part of parts) {
            if (current === null || current === undefined || typeof current !== 'object')
                return undefined;
            current = current[part];
        }
        return current;
    }
    resolveOperation(spec, path, method, operation, pathItem) {
        // Merge path-level and operation-level parameters
        const pathParams = (pathItem.parameters ?? []);
        const opParams = (operation.parameters ?? []);
        const mergedParams = [...pathParams, ...opParams];
        const parameters = mergedParams.map((p) => {
            const resolved = this.resolveRef(spec, p);
            return {
                name: resolved.name,
                in: resolved.in,
                required: resolved.required ?? false,
                description: resolved.description,
                schema: resolved.schema ? this.resolveRef(spec, resolved.schema) : {},
            };
        });
        // Resolve request body
        let requestBody;
        if (operation.requestBody) {
            const resolved = this.resolveRef(spec, operation.requestBody);
            const content = resolved.content;
            const jsonContent = content?.['application/json'];
            if (jsonContent?.schema) {
                requestBody = {
                    required: resolved.required ?? false,
                    description: resolved.description,
                    schema: this.resolveRef(spec, jsonContent.schema),
                };
            }
        }
        // Resolve responses
        const responses = {};
        const rawResponses = (operation.responses ?? {});
        for (const [statusCode, responseObj] of Object.entries(rawResponses)) {
            const resolved = this.resolveRef(spec, responseObj);
            const content = resolved.content;
            const jsonContent = content?.['application/json'];
            responses[statusCode] = {
                description: resolved.description,
                schema: jsonContent?.schema ? this.resolveRef(spec, jsonContent.schema) : undefined,
            };
        }
        return {
            path,
            method,
            operationId: operation.operationId,
            summary: operation.summary,
            description: operation.description,
            deprecated: operation.deprecated ?? undefined,
            tags: operation.tags ?? [],
            parameters,
            requestBody,
            responses,
        };
    }
}
exports.SpecLoader = SpecLoader;
