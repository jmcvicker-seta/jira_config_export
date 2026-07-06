/**
 * Evaluates where/filter conditions against in-memory values.
 *
 * Used by both the KVS key query builder and the entity query builder
 * to filter results in memory.
 */
import type { EntityFilterClauses, EntityWhereClauses } from './types.js';
/**
 * Evaluate a where clause against a value.
 * Returns true if the value matches the condition.
 */
export declare function evaluateWhereClause(value: unknown, clause: EntityWhereClauses): boolean;
/**
 * Evaluate a filter clause against a value.
 * Filter clauses are a superset of where clauses with additional conditions.
 */
export declare function evaluateFilterClause(value: unknown, clause: EntityFilterClauses): boolean;
/**
 * Sort results by key.
 */
export declare function sortByKey<T extends {
    key: string;
}>(items: T[], direction: 'ASC' | 'DESC'): T[];
/**
 * Sort results by a specific value (for entity index range attribute).
 */
export declare function sortByValue<T>(items: {
    key: string;
    value: T;
}[], getAttribute: (value: T) => unknown, direction: 'ASC' | 'DESC'): {
    key: string;
    value: T;
}[];
/**
 * Apply cursor-based pagination to a list of results.
 * Cursor is the key of the last item from the previous page.
 */
export declare function applyCursorPagination<T extends {
    key: string;
}>(items: T[], cursor?: string, limit?: number): {
    results: T[];
    nextCursor?: string;
};
