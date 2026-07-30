/**
 * In-memory implementation of @forge/kvs.
 *
 * Provides get/set/delete, key queries with BEGINS_WITH, secrets (separate namespace),
 * batch operations, transactions, and custom entity support with index validation.
 */
import type { EntityDefinition } from '../../manifest/types.js';
import type { BatchResult, BeginsWithClause, GetOptions, GetResult, ListResult, Result, Sort } from './types.js';
interface StoredEntry {
    value: unknown;
    createdAt: number;
    updatedAt: number;
}
/**
 * Maximum number of characters allowed for a single KVS value after JSON serialisation.
 * Matches the real Forge runtime limit (HTTP 413 if exceeded).
 * @see https://developer.atlassian.com/platform/forge/runtime-reference/storage-api/
 */
export declare const KVS_PER_KEY_CHAR_LIMIT = 245760;
declare class FakeQueryBuilder {
    private readonly store;
    private state;
    constructor(store: Map<string, StoredEntry>);
    where(property: 'key', condition: BeginsWithClause): this;
    cursor(cursor: string): this;
    limit(limit: number): this;
    getMany<T>(): Promise<ListResult<T>>;
    getOne<T>(): Promise<Result<T> | undefined>;
}
declare class FakeIndexQueryBuilder<T> {
    private readonly entityName;
    private readonly entityStore;
    private readonly entityDefs;
    constructor(entityName: string, entityStore: Map<string, StoredEntry>, entityDefs: EntityDefinition[]);
    index(name: string): FakeEntityQueryBuilder<T>;
}
declare class FakeEntityQueryBuilder<T> {
    private readonly entityName;
    private readonly entityStore;
    private readonly indexName;
    private readonly entityDefs;
    private state;
    constructor(entityName: string, entityStore: Map<string, StoredEntry>, indexName: string, entityDefs: EntityDefinition[]);
    where(condition: import('./types.js').EntityWhereClauses): this;
    filters(filterObj: {
        filters(): Array<{
            property: string;
            condition: string;
            values: unknown[];
        }>;
        operator(): 'and' | 'or';
    }): this;
    sort(sort: Sort): this;
    cursor(cursor: string): this;
    limit(limit: number): this;
    getMany(): Promise<ListResult<T>>;
    getOne(): Promise<Result<T> | undefined>;
    private getEntityEntries;
    private getRangeAttribute;
    private getAttributeValue;
    private applyFilters;
}
declare class FakeTransactionBuilder {
    private readonly kvsStore;
    private readonly entityStore;
    private readonly enforceSizeLimit;
    private operations;
    constructor(kvsStore: Map<string, StoredEntry>, entityStore: Map<string, StoredEntry>, enforceSizeLimit?: boolean);
    set<V>(key: string, value: V, entity?: {
        entityName: string;
    }): this;
    delete(key: string, entity?: {
        entityName: string;
    }): this;
    check(key: string, entity: {
        entityName: string;
        conditions: unknown;
    }): this;
    execute(): Promise<void>;
}
export interface FakeKvsOptions {
    /** Entity definitions from the parsed manifest, used for index validation */
    entityDefinitions?: EntityDefinition[];
    /**
     * When `true`, skip the per-key value size check (245,760 chars).
     * Useful for tests that deliberately exercise large values without
     * hitting Forge runtime limits.
     */
    disableSizeLimit?: boolean;
}
export declare class FakeKvs {
    private readonly kvsStore;
    private readonly secretStore;
    private readonly entityStore;
    entityDefs: EntityDefinition[];
    private readonly enforceSizeLimit;
    constructor(options?: FakeKvsOptions);
    /** Validate value size if enforcement is enabled. */
    private checkSize;
    get<T>(key: string, options?: GetOptions): Promise<T | GetResult<T> | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    batchSet<T>(items: Array<{
        key: string;
        value: T;
        entityName?: string;
    }>): Promise<BatchResult>;
    query(): FakeQueryBuilder;
    getSecret<T>(key: string, options?: GetOptions): Promise<T | GetResult<T> | undefined>;
    setSecret<T>(key: string, value: T): Promise<void>;
    deleteSecret(key: string): Promise<void>;
    entity<T>(entityName: string): {
        get: (key: string, options?: GetOptions) => Promise<T | GetResult<T> | undefined>;
        set: (key: string, value: T) => Promise<void>;
        delete: (key: string) => Promise<void>;
        query: () => FakeIndexQueryBuilder<T>;
    };
    transact(): FakeTransactionBuilder;
    /**
     * Clear all data (KVS, secrets, entities). Call between tests.
     */
    reset(): void;
    /**
     * Seed KVS data for tests.
     */
    seed(data: Record<string, unknown>): void;
    /**
     * Seed entity data for tests.
     */
    seedEntity(entityName: string, items: Array<{
        key: string;
        value: unknown;
    }>): void;
    private toGetResult;
}
export {};
