"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFixture = generateFixture;
exports.generateFromSchema = generateFromSchema;
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
function generateFixture(specLoader, product, path, method, options = {}) {
    const spec = specLoader.loadByProduct(product);
    const operation = specLoader.getOperation(spec, path, method);
    if (!operation)
        return undefined;
    const statusCode = options.statusCode ?? findSuccessStatus(operation.responses);
    const response = operation.responses[statusCode];
    if (!response?.schema) {
        return { status: parseInt(statusCode, 10), body: {} };
    }
    const maxDepth = options.maxDepth ?? 5;
    const body = generateFromSchema(response.schema, maxDepth, 0);
    return {
        status: parseInt(statusCode, 10),
        body,
    };
}
/**
 * Generate a value from a JSON Schema object.
 * Exported for direct use when you have a schema but not a full spec.
 */
function generateFromSchema(schema, maxDepth = 5, depth = 0) {
    if (depth > maxDepth)
        return undefined;
    // Use example if provided
    if ('example' in schema)
        return schema.example;
    // Handle $circular refs
    if ('$circular' in schema)
        return undefined;
    // Handle oneOf / anyOf — use first option
    const compositeKey = schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : undefined;
    if (compositeKey) {
        const options = schema[compositeKey];
        if (options.length > 0) {
            return generateFromSchema(options[0], maxDepth, depth);
        }
        return undefined;
    }
    // Handle allOf — merge all schemas
    if (schema.allOf) {
        const merged = {};
        for (const sub of schema.allOf) {
            const generated = generateFromSchema(sub, maxDepth, depth);
            if (generated && typeof generated === 'object' && !Array.isArray(generated)) {
                Object.assign(merged, generated);
            }
        }
        return merged;
    }
    // Handle enum
    if (schema.enum) {
        const values = schema.enum;
        return values[0];
    }
    const type = schema.type;
    const format = schema.format;
    switch (type) {
        case 'string':
            return generateString(format, schema);
        case 'number':
        case 'integer':
            return generateNumber(type, schema);
        case 'boolean':
            return schema.default ?? true;
        case 'array': {
            const items = schema.items;
            if (!items)
                return [];
            const element = generateFromSchema(items, maxDepth, depth + 1);
            return element !== undefined ? [element] : [];
        }
        case 'object':
        default: {
            // If there's a properties key, generate an object
            if (schema.properties) {
                return generateObject(schema, maxDepth, depth);
            }
            // If additionalProperties has a schema, generate one example entry
            if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
                const value = generateFromSchema(schema.additionalProperties, maxDepth, depth + 1);
                return { 'example-key': value };
            }
            // No properties, no type — could be a freeform object
            if (type === 'object')
                return {};
            return undefined;
        }
    }
}
function generateString(format, schema) {
    if (schema.default && typeof schema.default === 'string')
        return schema.default;
    switch (format) {
        case 'date':
            return '2024-01-15';
        case 'date-time':
            return '2024-01-15T10:30:00.000Z';
        case 'uri':
        case 'url':
            return 'https://example.atlassian.net';
        case 'email':
            return 'user@example.com';
        case 'uuid':
            return '00000000-0000-0000-0000-000000000000';
        case 'hostname':
            return 'example.atlassian.net';
        case 'ipv4':
            return '127.0.0.1';
        case 'binary':
            return '<binary>';
        default:
            return 'sample';
    }
}
function generateNumber(type, schema) {
    if (schema.default !== undefined && typeof schema.default === 'number')
        return schema.default;
    if (schema.minimum !== undefined)
        return schema.minimum;
    return type === 'integer' ? 1 : 1.0;
}
function generateObject(schema, maxDepth, depth) {
    const properties = schema.properties;
    const result = {};
    for (const [key, propSchema] of Object.entries(properties)) {
        const value = generateFromSchema(propSchema, maxDepth, depth + 1);
        if (value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}
/** Find the first success status code (2xx) in the responses */
function findSuccessStatus(responses) {
    const codes = Object.keys(responses).sort();
    const success = codes.find((c) => c.startsWith('2'));
    return success ?? codes[0] ?? '200';
}
