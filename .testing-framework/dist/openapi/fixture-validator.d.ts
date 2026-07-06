/**
 * Fixture Validator — validates fixture data against OpenAPI response schemas.
 *
 * Checks:
 * - Required properties are present
 * - Property types match the schema (string, number, boolean, array, object)
 * - Enum values are valid
 * - Nested objects are validated recursively
 *
 * Errors are actionable: each includes the JSON path and a clear message.
 */
import { SpecLoader } from './spec-loader.js';
/** A single validation error */
export interface ValidationError {
    /** JSON path to the invalid field (e.g. '/fields/summary') */
    path: string;
    /** Human-readable error message */
    message: string;
}
/** Result of validating a fixture */
export interface ValidationResult {
    /** Whether the fixture is valid */
    valid: boolean;
    /** List of validation errors (empty if valid) */
    errors: ValidationError[];
    /** Warnings (non-fatal issues like extra properties) */
    warnings: ValidationError[];
}
/** Options for fixture validation */
export interface ValidateFixtureOptions {
    /** HTTP status code to validate against (default: '200') */
    statusCode?: string;
    /** Whether to warn about extra properties not in the schema (default: true) */
    warnExtraProperties?: boolean;
}
/**
 * Validate a fixture body against an OpenAPI response schema.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name (e.g. 'jira', 'confluence')
 * @param path - API path (e.g. '/rest/api/3/issue/{issueIdOrKey}')
 * @param method - HTTP method (e.g. 'GET')
 * @param body - The fixture body to validate
 * @param options - Validation options
 *
 * @example
 * ```typescript
 * const loader = new SpecLoader();
 * const result = validateFixture(
 *   loader, 'jira', '/rest/api/3/issue/{issueIdOrKey}', 'GET',
 *   { id: '10001', key: 'TEST-1', fields: { summary: 'My issue' } },
 * );
 * if (!result.valid) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export declare function validateFixture(specLoader: SpecLoader, product: string, path: string, method: string, body: unknown, options?: ValidateFixtureOptions): ValidationResult;
/**
 * Validate a value against a schema directly (without loading a spec).
 * Useful when you already have the resolved schema.
 */
export declare function validateAgainstSchema(body: unknown, schema: Record<string, unknown>, options?: {
    warnExtraProperties?: boolean;
}): ValidationResult;
