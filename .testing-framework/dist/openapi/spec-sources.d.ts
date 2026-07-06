/**
 * OpenAPI specification sources for Atlassian product APIs.
 *
 * These specs can be used for:
 * - Generating fixture templates with correct response shapes
 * - Validating that fixture files match real API schemas
 * - Auto-generating fixture file suggestions in error messages
 */
export interface SpecSource {
    /** Human-readable name */
    name: string;
    /** Product area */
    product: string;
    /** Download URL for the OpenAPI v3 spec */
    url: string;
    /** Local filename (stored in the specs directory) */
    filename: string;
}
export declare const SPEC_SOURCES: SpecSource[];
