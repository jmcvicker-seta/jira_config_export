/**
 * Utility types and functions for context manipulation
 */
/**
 * Deep partial type that makes all properties optional recursively
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? T[P] extends Array<infer U> ? Array<DeepPartial<U>> : DeepPartial<T[P]> : T[P];
};
/**
 * Deep merge two objects, with the second object taking precedence
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with merged properties
 */
export declare function deepMerge<T>(target: T, source: DeepPartial<T>): T;
/**
 * Generate a list of all property paths in an object
 * @param obj - The object to extract paths from
 * @param prefix - Current path prefix (used for recursion)
 * @returns Array of dot-notation property paths
 */
export declare function generateFieldPaths(obj: unknown, prefix?: string): string[];
/**
 * Generate a schema representation of an object showing types instead of values
 * @param obj - The object to generate schema for
 * @returns Object with same structure but showing types
 */
export declare function generateSchema(obj: unknown): unknown;
