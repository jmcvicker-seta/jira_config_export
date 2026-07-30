/**
 * Drop-in replacement for @forge/kvs.
 *
 * When Jest/Vitest maps `@forge/kvs` to this module, app code like:
 *   import { kvs } from '@forge/kvs';
 * gets the fake implementation below.
 */
import { FakeKvs } from './fake-kvs.js';
declare const _kvs: FakeKvs;
declare function resetForgeKvsShim(): void;
export default _kvs;
export declare const kvs: FakeKvs;
export { FakeKvs, KVS_PER_KEY_CHAR_LIMIT } from './fake-kvs.js';
export type { FakeKvsOptions } from './fake-kvs.js';
export { WhereConditions, FilterConditions } from './conditions.js';
export { ForgeKvsError, ForgeKvsAPIError } from './errors.js';
export type { ForgeError, APIErrorResponseDetails } from './errors.js';
export { evaluateWhereClause, evaluateFilterClause, sortByKey, applyCursorPagination, } from './query-evaluator.js';
export { MetadataField, Sort, } from './types.js';
export type { BatchResult, BeginsWithClause, BetweenClause, ContainsClause, EqualToClause, EntityFilterClauses, EntityWhereClauses, ExistsClause, FilterItem, GetOptions, GetResult, GreaterThanClause, GreaterThanEqualToClause, LessThanClause, LessThanEqualToClause, ListResult, NotContainsClause, NotEqualToClause, NotExistsClause, Result, StringOrNumber, StringOrNumberOrBoolean, WhereClause, } from './types.js';
export { _kvs, resetForgeKvsShim };
