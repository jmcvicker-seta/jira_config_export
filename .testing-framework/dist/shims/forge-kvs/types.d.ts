/**
 * Types matching @forge/kvs's public API surface.
 *
 * These are re-declared here so the shim has no runtime dependency on @forge/kvs.
 * They match @forge/kvs v1.2.6.
 */
export type StringOrNumber = string | number;
export type StringOrNumberOrBoolean = string | number | boolean;
export interface BetweenClause<T extends StringOrNumber> {
    condition: 'BETWEEN';
    values: [T, T];
}
export interface BeginsWithClause {
    condition: 'BEGINS_WITH';
    values: [StringOrNumber];
}
export interface ExistsClause {
    condition: 'EXISTS';
    values: [true];
}
export interface NotExistsClause {
    condition: 'NOT_EXISTS';
    values: [true];
}
export interface GreaterThanClause {
    condition: 'GREATER_THAN';
    values: [StringOrNumber];
}
export interface GreaterThanEqualToClause {
    condition: 'GREATER_THAN_EQUAL_TO';
    values: [StringOrNumber];
}
export interface LessThanClause {
    condition: 'LESS_THAN';
    values: [StringOrNumber];
}
export interface LessThanEqualToClause {
    condition: 'LESS_THAN_EQUAL_TO';
    values: [StringOrNumber];
}
export interface ContainsClause {
    condition: 'CONTAINS';
    values: [string];
}
export interface NotContainsClause {
    condition: 'NOT_CONTAINS';
    values: [string];
}
export interface EqualToClause {
    condition: 'EQUAL_TO';
    values: [StringOrNumberOrBoolean];
}
export interface NotEqualToClause {
    condition: 'NOT_EQUAL_TO';
    values: [StringOrNumberOrBoolean];
}
export type EntityWhereClauses = BetweenClause<StringOrNumber> | BeginsWithClause | EqualToClause | GreaterThanClause | GreaterThanEqualToClause | LessThanClause | LessThanEqualToClause;
export type EntityFilterClauses = BetweenClause<StringOrNumber> | BeginsWithClause | ExistsClause | NotExistsClause | GreaterThanClause | GreaterThanEqualToClause | LessThanClause | LessThanEqualToClause | ContainsClause | NotContainsClause | EqualToClause | NotEqualToClause;
export type WhereClause = BeginsWithClause;
export declare enum MetadataField {
    CREATED_AT = "CREATED_AT",
    UPDATED_AT = "UPDATED_AT"
}
export interface GetOptions {
    metadataFields?: MetadataField[];
}
export interface GetResult<T> {
    key: string;
    value: T;
    createdAt?: number;
    updatedAt?: number;
}
export interface Result<T> {
    key: string;
    value: T;
}
export interface ListResult<T> {
    results: Result<T>[];
    nextCursor?: string;
}
export interface BatchResult {
    successfulKeys: {
        key: string;
        entityName?: string;
    }[];
    failedKeys: {
        key: string;
        entityName?: string;
        error: {
            code: string;
            message: string;
        };
    }[];
}
export declare enum Sort {
    ASC = "ASC",
    DESC = "DESC"
}
export type FilterOperator = 'or' | 'and';
export type FilterItem<T> = EntityFilterClauses & {
    property: keyof T;
};
