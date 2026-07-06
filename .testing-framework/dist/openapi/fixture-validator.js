"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFixture = validateFixture;
exports.validateAgainstSchema = validateAgainstSchema;
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
function validateFixture(specLoader, product, path, method, body, options = {}) {
    const spec = specLoader.loadByProduct(product);
    const operation = specLoader.getOperation(spec, path, method);
    if (!operation) {
        return {
            valid: false,
            errors: [{ path: '', message: `Operation ${method.toUpperCase()} ${path} not found in ${product} spec` }],
            warnings: [],
        };
    }
    const statusCode = options.statusCode ?? findSuccessStatus(operation.responses);
    const response = operation.responses[statusCode];
    if (!response) {
        return {
            valid: false,
            errors: [{ path: '', message: `No response defined for status ${statusCode}` }],
            warnings: [],
        };
    }
    if (!response.schema) {
        // No schema defined — can't validate, assume valid
        return { valid: true, errors: [], warnings: [] };
    }
    const errors = [];
    const warnings = [];
    const warnExtra = options.warnExtraProperties ?? true;
    validateValue(body, response.schema, '', errors, warnings, warnExtra);
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Validate a value against a schema directly (without loading a spec).
 * Useful when you already have the resolved schema.
 */
function validateAgainstSchema(body, schema, options = {}) {
    const errors = [];
    const warnings = [];
    validateValue(body, schema, '', errors, warnings, options.warnExtraProperties ?? true);
    return { valid: errors.length === 0, errors, warnings };
}
function validateValue(value, schema, path, errors, warnings, warnExtra) {
    // Handle $circular — can't validate further
    if ('$circular' in schema || '$unresolved' in schema)
        return;
    // Handle oneOf / anyOf — value must match at least one
    const compositeKey = schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : undefined;
    if (compositeKey) {
        const options = schema[compositeKey];
        const matchErrors = options.map((opt) => {
            const subErrors = [];
            validateValue(value, opt, path, subErrors, [], false);
            return subErrors;
        });
        const anyMatch = matchErrors.some((e) => e.length === 0);
        if (!anyMatch && options.length > 0) {
            errors.push({
                path,
                message: `Value does not match any of the ${options.length} ${compositeKey} options`,
            });
        }
        return;
    }
    // Handle allOf — value must match all
    if (schema.allOf) {
        for (const sub of schema.allOf) {
            validateValue(value, sub, path, errors, warnings, warnExtra);
        }
        return;
    }
    // Handle enum
    if (schema.enum) {
        const allowed = schema.enum;
        if (!allowed.includes(value)) {
            errors.push({
                path,
                message: `Value ${JSON.stringify(value)} is not one of the allowed enum values: ${allowed.map((v) => JSON.stringify(v)).join(', ')}`,
            });
        }
        return;
    }
    if (value === null || value === undefined) {
        if (schema.nullable)
            return;
        // Null/undefined is only an error if the field was required (handled at parent level)
        return;
    }
    const type = schema.type;
    switch (type) {
        case 'string':
            if (typeof value !== 'string') {
                errors.push({ path, message: `Expected string, got ${typeof value}` });
            }
            break;
        case 'number':
        case 'integer':
            if (typeof value !== 'number') {
                errors.push({ path, message: `Expected ${type}, got ${typeof value}` });
            }
            else if (type === 'integer' && !Number.isInteger(value)) {
                errors.push({ path, message: `Expected integer, got float ${value}` });
            }
            break;
        case 'boolean':
            if (typeof value !== 'boolean') {
                errors.push({ path, message: `Expected boolean, got ${typeof value}` });
            }
            break;
        case 'array':
            if (!Array.isArray(value)) {
                errors.push({ path, message: `Expected array, got ${typeof value}` });
            }
            else if (schema.items) {
                const itemSchema = schema.items;
                for (let i = 0; i < value.length; i++) {
                    validateValue(value[i], itemSchema, `${path}/${i}`, errors, warnings, warnExtra);
                }
            }
            break;
        case 'object':
        default:
            if (typeof value !== 'object' || Array.isArray(value)) {
                if (type === 'object') {
                    errors.push({ path, message: `Expected object, got ${Array.isArray(value) ? 'array' : typeof value}` });
                }
                break;
            }
            validateObject(value, schema, path, errors, warnings, warnExtra);
            break;
    }
}
function validateObject(value, schema, path, errors, warnings, warnExtra) {
    const properties = (schema.properties ?? {});
    const required = (schema.required ?? []);
    // Check required fields
    for (const requiredKey of required) {
        if (!(requiredKey in value)) {
            errors.push({
                path: `${path}/${requiredKey}`,
                message: `Required property '${requiredKey}' is missing`,
            });
        }
    }
    // Validate known properties
    for (const [key, propSchema] of Object.entries(properties)) {
        if (key in value) {
            validateValue(value[key], propSchema, `${path}/${key}`, errors, warnings, warnExtra);
        }
    }
    // Check for extra properties
    if (warnExtra && Object.keys(properties).length > 0) {
        const knownKeys = new Set(Object.keys(properties));
        for (const key of Object.keys(value)) {
            if (!knownKeys.has(key)) {
                warnings.push({
                    path: `${path}/${key}`,
                    message: `Extra property '${key}' is not defined in the schema`,
                });
            }
        }
    }
}
function findSuccessStatus(responses) {
    const codes = Object.keys(responses).sort();
    const success = codes.find((c) => c.startsWith('2'));
    return success ?? codes[0] ?? '200';
}
