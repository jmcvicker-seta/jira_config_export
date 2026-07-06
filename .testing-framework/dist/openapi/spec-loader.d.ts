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
/** A resolved OpenAPI operation with all $refs expanded */
export interface ResolvedOperation {
    /** The API path (e.g. '/rest/api/3/issue/{issueIdOrKey}') */
    path: string;
    /** HTTP method (lowercase) */
    method: string;
    /** Operation ID from the spec */
    operationId?: string;
    /** Human-readable summary */
    summary?: string;
    /** Detailed description */
    description?: string;
    /** Whether this operation is deprecated according to the OpenAPI spec */
    deprecated?: boolean;
    /** Tags for categorisation */
    tags: string[];
    /** Resolved path and query parameters */
    parameters: ResolvedParameter[];
    /** Resolved request body schema (if any) */
    requestBody?: ResolvedRequestBody;
    /** Resolved response schemas keyed by status code */
    responses: Record<string, ResolvedResponse>;
}
export interface ResolvedParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required: boolean;
    description?: string;
    schema: Record<string, unknown>;
}
export interface ResolvedRequestBody {
    required: boolean;
    description?: string;
    schema: Record<string, unknown>;
}
export interface ResolvedResponse {
    description?: string;
    schema?: Record<string, unknown>;
}
/** Minimal OpenAPI document type for the parts we access */
interface OpenAPIDocument {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    servers?: Array<{
        url: string;
    }>;
    paths: Record<string, Record<string, unknown>>;
    components?: {
        schemas?: Record<string, unknown>;
    };
}
export declare class SpecLoader {
    private readonly specsDir;
    private readonly specCache;
    constructor(specsDir?: string);
    /**
     * Load the first spec registered for a product (SPEC_SOURCES order — newest API version preferred).
     * Use {@link loadAllByProduct} to load every spec for a product (e.g. v1 + v2).
     */
    loadByProduct(product: string): OpenAPIDocument;
    /**
     * Load every spec registered for a product, in SPEC_SOURCES order.
     * Missing spec files are silently skipped — they're downloaded on demand
     * via `yarn download-specs`.
     */
    loadAllByProduct(product: string): OpenAPIDocument[];
    /**
     * Load a spec by filename (e.g. 'jira-platform.v3.json').
     */
    loadSpec(filename: string): OpenAPIDocument;
    /**
     * List all available spec files in the specs directory.
     */
    listAvailableSpecs(): string[];
    /**
     * Get a resolved operation from a spec.
     */
    getOperation(spec: OpenAPIDocument, path: string, method: string): ResolvedOperation | undefined;
    /**
     * List all operations in a spec.
     */
    listOperations(spec: OpenAPIDocument): ResolvedOperation[];
    /**
     * Resolve all $ref references in a schema object.
     * Handles circular references by stopping at a configurable depth.
     */
    resolveRef(spec: OpenAPIDocument, obj: unknown, maxDepth?: number): Record<string, unknown>;
    private resolveRefInternal;
    private lookupRef;
    private resolveOperation;
}
export {};
