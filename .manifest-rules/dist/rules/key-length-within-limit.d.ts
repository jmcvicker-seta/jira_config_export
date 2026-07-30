/**
 * Validation rule: key-length-within-limit
 *
 * Ensures all manifest keys (module, function, resource, remote) do not exceed the
 * Forge platform's 23-character maximum length. The limit is enforced server-side by
 * XLS (xen-lifecycle-service) and declared in the @forge/manifest JSON schema.
 *
 * Keys must also match the pattern [a-zA-Z0-9_-]+ (alphanumerics, hyphens, underscores).
 * Convention is lowercase-with-hyphens and short suffixes like -fn, -res, -handler.
 */
import type { ValidationError } from '../types.js';
export declare const RULE_NAME = "key-length-within-limit";
export declare const MAX_KEY_LENGTH = 23;
/**
 * Validate all manifest keys are within the 23-character limit.
 *
 * Walks the following manifest sections:
 * - modules.* (all module types, including modules.function)
 * - resources (hosted resource entries)
 * - remotes (remote backend definitions)
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @returns Array of validation errors
 */
export declare function validateKeyLengthWithinLimit(yamlContent: string): ValidationError[];
//# sourceMappingURL=key-length-within-limit.d.ts.map