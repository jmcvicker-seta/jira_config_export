/**
 * WhereConditions and FilterConditions factories matching @forge/kvs.
 */
import type { BeginsWithClause, BetweenClause, ContainsClause, EqualToClause, ExistsClause, GreaterThanClause, GreaterThanEqualToClause, LessThanClause, LessThanEqualToClause, NotContainsClause, NotEqualToClause, NotExistsClause, StringOrNumber, StringOrNumberOrBoolean } from './types.js';
declare function between<T extends StringOrNumber>(firstValue: T, secondValue: T): BetweenClause<T>;
declare function beginsWith(value: StringOrNumber): BeginsWithClause;
declare function exists(): ExistsClause;
declare function notExists(): NotExistsClause;
declare function greaterThan(value: StringOrNumber): GreaterThanClause;
declare function greaterThanEqualTo(value: StringOrNumber): GreaterThanEqualToClause;
declare function lessThan(value: StringOrNumber): LessThanClause;
declare function lessThanEqualTo(value: StringOrNumber): LessThanEqualToClause;
declare function contains(value: string): ContainsClause;
declare function notContains(value: string): NotContainsClause;
declare function equalTo(value: StringOrNumberOrBoolean): EqualToClause;
declare function notEqualTo(value: StringOrNumberOrBoolean): NotEqualToClause;
/** Conditions usable in KVS key queries and entity range queries */
export declare const WhereConditions: {
    readonly beginsWith: typeof beginsWith;
    readonly between: typeof between;
    readonly equalTo: typeof equalTo;
    readonly greaterThan: typeof greaterThan;
    readonly greaterThanEqualTo: typeof greaterThanEqualTo;
    readonly lessThan: typeof lessThan;
    readonly lessThanEqualTo: typeof lessThanEqualTo;
};
/** Conditions usable in entity filter clauses */
export declare const FilterConditions: {
    readonly beginsWith: typeof beginsWith;
    readonly between: typeof between;
    readonly contains: typeof contains;
    readonly notContains: typeof notContains;
    readonly equalTo: typeof equalTo;
    readonly notEqualTo: typeof notEqualTo;
    readonly exists: typeof exists;
    readonly notExists: typeof notExists;
    readonly greaterThan: typeof greaterThan;
    readonly greaterThanEqualTo: typeof greaterThanEqualTo;
    readonly lessThan: typeof lessThan;
    readonly lessThanEqualTo: typeof lessThanEqualTo;
};
export {};
