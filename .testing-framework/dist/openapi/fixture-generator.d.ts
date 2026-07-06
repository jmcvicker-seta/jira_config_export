/**
 * Fixture Generator — creates fixture templates from OpenAPI response schemas.
 *
 * Generates JSON objects with realistic placeholder values based on the schema:
 * - Uses `example` values from the spec when available
 * - Format-specific defaults (date, uri, email, uuid)
 * - Enum values use the first option
 * - Arrays contain a single representative element
 * - Recursive/circular schemas are handled gracefully
 */
import { SpecLoader } from './spec-loader.js';
import type { FixtureResponse } from '../fixtures/types.js';
/** Options for fixture generation */
export interface GenerateFixtureOptions {
    /** HTTP status code to generate fixture for (default: '200') */
    statusCode?: string;
    /** Max depth for nested object expansion (default: 5) */
    maxDepth?: number;
}
/**
 * Generate a fixture template from an OpenAPI response schema.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name (e.g. 'jira', 'confluence')
 * @param path - API path (e.g. '/rest/api/3/issue/{issueIdOrKey}')
 * @param method - HTTP method (e.g. 'GET')
 * @param options - Generation options
 * @returns FixtureResponse with placeholder body, or undefined if no schema found
 *
 * @example
 * ```typescript
 * const loader = new SpecLoader();
 * const fixture = generateFixture(loader, 'jira', '/rest/api/3/issue/{issueIdOrKey}', 'GET');
 * // { status: 200, body: { id: 'sample', key: 'sample', fields: { ... } } }
 * ```
 */
export declare function generateFixture(specLoader: SpecLoader, product: string, path: string, method: string, options?: GenerateFixtureOptions): FixtureResponse | undefined;
/**
 * Generate a value from a JSON Schema object.
 * Exported for direct use when you have a schema but not a full spec.
 */
export declare function generateFromSchema(schema: Record<string, unknown>, maxDepth?: number, depth?: number): unknown;
