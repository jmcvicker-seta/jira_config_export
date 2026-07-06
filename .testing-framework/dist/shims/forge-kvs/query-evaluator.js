"use strict";
/**
 * Evaluates where/filter conditions against in-memory values.
 *
 * Used by both the KVS key query builder and the entity query builder
 * to filter results in memory.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateWhereClause = evaluateWhereClause;
exports.evaluateFilterClause = evaluateFilterClause;
exports.sortByKey = sortByKey;
exports.sortByValue = sortByValue;
exports.applyCursorPagination = applyCursorPagination;
/**
 * Evaluate a where clause against a value.
 * Returns true if the value matches the condition.
 */
function evaluateWhereClause(value, clause) {
    switch (clause.condition) {
        case 'BEGINS_WITH':
            return String(value).startsWith(String(clause.values[0]));
        case 'BETWEEN':
            return compare(value, clause.values[0]) >= 0 && compare(value, clause.values[1]) <= 0;
        case 'EQUAL_TO':
            return value === clause.values[0];
        case 'GREATER_THAN':
            return compare(value, clause.values[0]) > 0;
        case 'GREATER_THAN_EQUAL_TO':
            return compare(value, clause.values[0]) >= 0;
        case 'LESS_THAN':
            return compare(value, clause.values[0]) < 0;
        case 'LESS_THAN_EQUAL_TO':
            return compare(value, clause.values[0]) <= 0;
        default:
            return false;
    }
}
/**
 * Evaluate a filter clause against a value.
 * Filter clauses are a superset of where clauses with additional conditions.
 */
function evaluateFilterClause(value, clause) {
    switch (clause.condition) {
        case 'EXISTS':
            return value !== undefined && value !== null;
        case 'NOT_EXISTS':
            return value === undefined || value === null;
        case 'CONTAINS':
            return typeof value === 'string' && value.includes(clause.values[0]);
        case 'NOT_CONTAINS':
            return typeof value !== 'string' || !value.includes(clause.values[0]);
        case 'NOT_EQUAL_TO':
            return value !== clause.values[0];
        default:
            // All WhereConditions are also valid FilterConditions
            return evaluateWhereClause(value, clause);
    }
}
/**
 * Compare two values for ordering.
 * Numbers are compared numerically, strings lexicographically.
 */
function compare(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    const strA = String(a);
    const strB = String(b);
    if (strA < strB)
        return -1;
    if (strA > strB)
        return 1;
    return 0;
}
/**
 * Sort results by key.
 */
function sortByKey(items, direction) {
    const sorted = [...items].sort((a, b) => {
        if (a.key < b.key)
            return -1;
        if (a.key > b.key)
            return 1;
        return 0;
    });
    return direction === 'DESC' ? sorted.reverse() : sorted;
}
/**
 * Sort results by a specific value (for entity index range attribute).
 */
function sortByValue(items, getAttribute, direction) {
    const sorted = [...items].sort((a, b) => compare(getAttribute(a.value), getAttribute(b.value)));
    return direction === 'DESC' ? sorted.reverse() : sorted;
}
/**
 * Apply cursor-based pagination to a list of results.
 * Cursor is the key of the last item from the previous page.
 */
function applyCursorPagination(items, cursor, limit) {
    let startIndex = 0;
    if (cursor) {
        const cursorIndex = items.findIndex((item) => item.key === cursor);
        startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }
    const effectiveLimit = limit ?? 20; // Forge default limit
    const page = items.slice(startIndex, startIndex + effectiveLimit);
    const hasMore = startIndex + effectiveLimit < items.length;
    return {
        results: page,
        nextCursor: hasMore ? page[page.length - 1]?.key : undefined,
    };
}
