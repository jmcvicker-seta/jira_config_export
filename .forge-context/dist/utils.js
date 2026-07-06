"use strict";
/**
 * Utility types and functions for context manipulation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = deepMerge;
exports.generateFieldPaths = generateFieldPaths;
exports.generateSchema = generateSchema;
/**
 * Type guard to check if a value is a plain object
 */
function isPlainObject(value) {
    return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !(value instanceof RegExp);
}
/**
 * Deep merge two objects, with the second object taking precedence
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with merged properties
 */
function deepMerge(target, source) {
    if (!isPlainObject(target) || !isPlainObject(source)) {
        return (source ?? target);
    }
    const result = JSON.parse(JSON.stringify(target));
    function mergeRecursive(targetObj, sourceObj) {
        for (const key in sourceObj) {
            if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
                const sourceValue = sourceObj[key];
                const targetValue = targetObj[key];
                if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
                    mergeRecursive(targetValue, sourceValue);
                }
                else if (sourceValue !== undefined) {
                    targetObj[key] = sourceValue;
                }
            }
        }
    }
    mergeRecursive(result, source);
    return result;
}
/**
 * Generate a list of all property paths in an object
 * @param obj - The object to extract paths from
 * @param prefix - Current path prefix (used for recursion)
 * @returns Array of dot-notation property paths
 */
function generateFieldPaths(obj, prefix = '') {
    if (!isPlainObject(obj)) {
        return prefix ? [prefix] : [];
    }
    const paths = [];
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        if (isPlainObject(value)) {
            // Recursively get paths for nested objects
            paths.push(...generateFieldPaths(value, currentPath));
        }
        else {
            // Add leaf property paths
            paths.push(currentPath);
        }
    }
    return paths;
}
/**
 * Generate a schema representation of an object showing types instead of values
 * @param obj - The object to generate schema for
 * @returns Object with same structure but showing types
 */
function generateSchema(obj) {
    if (obj === null) {
        return null;
    }
    if (Array.isArray(obj)) {
        return obj.length > 0 ? [generateSchema(obj[0])] : [];
    }
    if (isPlainObject(obj)) {
        const schema = {};
        for (const [key, value] of Object.entries(obj)) {
            schema[key] = generateSchema(value);
        }
        return schema;
    }
    return typeof obj;
}
