/**
 * TypeScript types for the manifest validation package.
 */
/**
 * A validation error with location information for agent-friendly output.
 */
export interface ValidationError {
    /** The rule that was violated */
    rule: string;
    /** Human-readable error message */
    message: string;
    /** Suggested fix for the error */
    suggestion: string;
    /** 1-indexed line number where the error occurred */
    line: number;
    /** 1-indexed column number where the error occurred */
    column: number;
    /** The module type (e.g., 'jira:globalPage') */
    moduleType: string;
    /** The module key (e.g., 'my-global-page') */
    moduleKey: string;
}
/**
 * Result of validating a manifest file.
 */
export interface ValidationResult {
    /** Whether the manifest is valid (no errors) */
    valid: boolean;
    /** List of validation errors */
    errors: ValidationError[];
    /** Path to the manifest file that was validated */
    filePath?: string;
}
/**
 * A parsed module entry from the manifest.
 */
export interface ManifestModule {
    key: string;
    resource?: string;
    render?: 'default' | 'native';
    [key: string]: unknown;
}
//# sourceMappingURL=types.d.ts.map