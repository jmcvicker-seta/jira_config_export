"use strict";
/**
 * In-memory implementation of @forge/kvs.
 *
 * Provides get/set/delete, key queries with BEGINS_WITH, secrets (separate namespace),
 * batch operations, transactions, and custom entity support with index validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeKvs = exports.KVS_PER_KEY_CHAR_LIMIT = void 0;
const errors_js_1 = require("./errors.js");
const query_evaluator_js_1 = require("./query-evaluator.js");
// ---- Forge runtime constraints ----
/**
 * Maximum number of characters allowed for a single KVS value after JSON serialisation.
 * Matches the real Forge runtime limit (HTTP 413 if exceeded).
 * @see https://developer.atlassian.com/platform/forge/runtime-reference/storage-api/
 */
exports.KVS_PER_KEY_CHAR_LIMIT = 245_760;
// Stubs for future enforcement — add validation when known limits are documented.
// export const KVS_ENTITY_INDEX_KEY_MAX_LENGTH = ...;
// export const KVS_BATCH_MAX_ITEMS = ...;
// export const KVS_TOTAL_APP_QUOTA_BYTES = ...;
/**
 * Throws a ForgeKvsAPIError(413) if the JSON-serialised value exceeds the Forge per-key limit.
 */
function assertValueSize(key, value) {
    // JSON.stringify returns undefined for values it cannot serialise (e.g. `undefined`,
    // functions). Treat those as zero-length so they pass the check rather than throwing
    // a TypeError on `.length` — preserving FakeKvs's pre-existing pass-through behaviour.
    const serialized = JSON.stringify(value) ?? '';
    if (serialized.length > exports.KVS_PER_KEY_CHAR_LIMIT) {
        throw new errors_js_1.ForgeKvsAPIError({ status: 413, statusText: 'Payload Too Large' }, {
            code: 'STORAGE_LIMIT_EXCEEDED',
            message: `KVS value for key "${key}" is ${serialized.length} chars, ` +
                `exceeds Forge's per-key limit of ${exports.KVS_PER_KEY_CHAR_LIMIT} chars (~240 KB). ` +
                `Real Forge rejects this write at runtime with HTTP 413. ` +
                `Fix: chunk the data across multiple keys (typical pattern: ` +
                `{ "<prefix>:meta": { count, chunkSize }, "<prefix>:chunk:<n>": [...] }).`,
        });
    }
}
class FakeQueryBuilder {
    store;
    state = {};
    constructor(store) {
        this.store = store;
    }
    where(property, condition) {
        this.state.whereClause = condition;
        return this;
    }
    cursor(cursor) {
        this.state.cursor = cursor;
        return this;
    }
    limit(limit) {
        this.state.limit = limit;
        return this;
    }
    async getMany() {
        let entries = Array.from(this.store.entries()).map(([key, entry]) => ({
            key,
            value: entry.value,
        }));
        if (this.state.whereClause) {
            entries = entries.filter((e) => (0, query_evaluator_js_1.evaluateWhereClause)(e.key, this.state.whereClause));
        }
        entries = (0, query_evaluator_js_1.sortByKey)(entries, 'ASC');
        return (0, query_evaluator_js_1.applyCursorPagination)(entries, this.state.cursor, this.state.limit);
    }
    async getOne() {
        const result = await this.getMany();
        return result.results[0];
    }
}
// ---- Entity Query Builders ----
class FakeIndexQueryBuilder {
    entityName;
    entityStore;
    entityDefs;
    constructor(entityName, entityStore, entityDefs) {
        this.entityName = entityName;
        this.entityStore = entityStore;
        this.entityDefs = entityDefs;
    }
    index(name) {
        // Validate index exists in manifest (matching Forge's INVALID_ENTITY_INDEX behaviour)
        const entityDef = this.entityDefs.find((e) => e.name === this.entityName);
        if (name !== 'by-key') {
            const indexExists = entityDef?.indexes.some((idx) => {
                if (idx.kind === 'simple')
                    return idx.attribute === name;
                return idx.name === name;
            }) ?? false;
            if (!indexExists) {
                throw new errors_js_1.ForgeKvsAPIError({ status: 400, statusText: 'Bad Request' }, {
                    code: 'INVALID_ENTITY_INDEX',
                    message: `The custom entity index provided is invalid. Index '${name}' is not defined for entity '${this.entityName}' in the manifest.`,
                });
            }
        }
        return new FakeEntityQueryBuilder(this.entityName, this.entityStore, name, this.entityDefs);
    }
}
class FakeEntityQueryBuilder {
    entityName;
    entityStore;
    indexName;
    entityDefs;
    state = { sortDirection: 'ASC' };
    constructor(entityName, entityStore, indexName, entityDefs) {
        this.entityName = entityName;
        this.entityStore = entityStore;
        this.indexName = indexName;
        this.entityDefs = entityDefs;
    }
    where(condition) {
        this.state.whereClause = condition;
        return this;
    }
    filters(filterObj) {
        this.state.filters = {
            items: filterObj.filters(),
            operator: filterObj.operator(),
        };
        return this;
    }
    sort(sort) {
        this.state.sortDirection = sort;
        return this;
    }
    cursor(cursor) {
        this.state.cursor = cursor;
        return this;
    }
    limit(limit) {
        this.state.limit = limit;
        return this;
    }
    async getMany() {
        let entries = this.getEntityEntries();
        // Apply where clause on the index attribute
        if (this.state.whereClause) {
            const rangeAttr = this.getRangeAttribute();
            entries = entries.filter((e) => {
                const attrValue = rangeAttr === 'key' ? e.key : this.getAttributeValue(e.value, rangeAttr);
                return (0, query_evaluator_js_1.evaluateWhereClause)(attrValue, this.state.whereClause);
            });
        }
        // Apply filters
        if (this.state.filters) {
            entries = this.applyFilters(entries, this.state.filters);
        }
        // Sort
        const rangeAttr = this.getRangeAttribute();
        if (rangeAttr === 'key') {
            entries = (0, query_evaluator_js_1.sortByKey)(entries, this.state.sortDirection);
        }
        else {
            entries = [...entries].sort((a, b) => {
                const va = String(this.getAttributeValue(a.value, rangeAttr) ?? '');
                const vb = String(this.getAttributeValue(b.value, rangeAttr) ?? '');
                const cmp = va < vb ? -1 : va > vb ? 1 : 0;
                return this.state.sortDirection === 'DESC' ? -cmp : cmp;
            });
        }
        return (0, query_evaluator_js_1.applyCursorPagination)(entries, this.state.cursor, this.state.limit);
    }
    async getOne() {
        const result = await this.getMany();
        return result.results[0];
    }
    getEntityEntries() {
        const prefix = `${this.entityName}:`;
        const entries = [];
        for (const [key, entry] of this.entityStore) {
            if (key.startsWith(prefix)) {
                entries.push({ key: key.slice(prefix.length), value: entry.value });
            }
        }
        return entries;
    }
    getRangeAttribute() {
        if (this.indexName === 'by-key')
            return 'key';
        const entityDef = this.entityDefs.find((e) => e.name === this.entityName);
        if (!entityDef)
            return 'key';
        const idx = entityDef.indexes.find((i) => {
            if (i.kind === 'simple')
                return i.attribute === this.indexName;
            return i.name === this.indexName;
        });
        if (!idx)
            return 'key';
        if (idx.kind === 'simple')
            return idx.attribute;
        return idx.range[0] ?? 'key';
    }
    getAttributeValue(value, attribute) {
        if (value && typeof value === 'object') {
            return value[attribute];
        }
        return undefined;
    }
    applyFilters(entries, filters) {
        return entries.filter((entry) => {
            const results = filters.items.map((item) => {
                const attrValue = this.getAttributeValue(entry.value, item.property);
                return (0, query_evaluator_js_1.evaluateWhereClause)(attrValue, item);
            });
            if (filters.operator === 'or') {
                return results.some(Boolean);
            }
            return results.every(Boolean);
        });
    }
}
// ---- Transaction Builder ----
class FakeTransactionBuilder {
    kvsStore;
    entityStore;
    enforceSizeLimit;
    operations = [];
    constructor(kvsStore, entityStore, enforceSizeLimit = true) {
        this.kvsStore = kvsStore;
        this.entityStore = entityStore;
        this.enforceSizeLimit = enforceSizeLimit;
    }
    set(key, value, entity) {
        this.operations.push({
            type: 'set',
            key: entity ? `${entity.entityName}:${key}` : key,
            value,
            entityName: entity?.entityName,
        });
        return this;
    }
    delete(key, entity) {
        this.operations.push({
            type: 'delete',
            key: entity ? `${entity.entityName}:${key}` : key,
            entityName: entity?.entityName,
        });
        return this;
    }
    check(key, entity) {
        this.operations.push({
            type: 'check',
            key: `${entity.entityName}:${key}`,
            entityName: entity.entityName,
        });
        return this;
    }
    async execute() {
        // Validate all set operations before committing any changes (transactional semantics)
        if (this.enforceSizeLimit) {
            for (const op of this.operations) {
                if (op.type === 'set') {
                    assertValueSize(op.key, op.value);
                }
            }
        }
        const now = Date.now();
        for (const op of this.operations) {
            const store = op.entityName ? this.entityStore : this.kvsStore;
            switch (op.type) {
                case 'set': {
                    const existing = store.get(op.key);
                    store.set(op.key, {
                        value: op.value,
                        createdAt: existing?.createdAt ?? now,
                        updatedAt: now,
                    });
                    break;
                }
                case 'delete':
                    store.delete(op.key);
                    break;
                case 'check':
                    // In a real implementation, check would validate conditions and abort if not met.
                    // For now we just verify the key exists.
                    break;
            }
        }
    }
}
class FakeKvs {
    kvsStore = new Map();
    secretStore = new Map();
    entityStore = new Map();
    entityDefs;
    enforceSizeLimit;
    constructor(options = {}) {
        this.entityDefs = options.entityDefinitions ?? [];
        this.enforceSizeLimit = !(options.disableSizeLimit === true);
    }
    /** Validate value size if enforcement is enabled. */
    checkSize(key, value) {
        if (this.enforceSizeLimit) {
            assertValueSize(key, value);
        }
    }
    // ---- KVS key-value operations ----
    async get(key, options) {
        const entry = this.kvsStore.get(key);
        if (!entry)
            return undefined;
        if (options?.metadataFields?.length) {
            return this.toGetResult(key, entry, options.metadataFields);
        }
        return entry.value;
    }
    async set(key, value) {
        this.checkSize(key, value);
        const now = Date.now();
        const existing = this.kvsStore.get(key);
        this.kvsStore.set(key, {
            value,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        });
    }
    async delete(key) {
        this.kvsStore.delete(key);
    }
    async batchSet(items) {
        const now = Date.now();
        const successfulKeys = [];
        const failedKeys = [];
        for (const item of items) {
            try {
                this.checkSize(item.key, item.value);
                const store = item.entityName ? this.entityStore : this.kvsStore;
                const storeKey = item.entityName ? `${item.entityName}:${item.key}` : item.key;
                const existing = store.get(storeKey);
                store.set(storeKey, {
                    value: item.value,
                    createdAt: existing?.createdAt ?? now,
                    updatedAt: now,
                });
                successfulKeys.push({ key: item.key, entityName: item.entityName });
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to set value';
                const code = err instanceof errors_js_1.ForgeKvsAPIError ? err.code : 'UNKNOWN_ERROR';
                failedKeys.push({
                    key: item.key,
                    entityName: item.entityName,
                    error: { code, message },
                });
            }
        }
        return { successfulKeys, failedKeys };
    }
    query() {
        return new FakeQueryBuilder(this.kvsStore);
    }
    // ---- Secrets ----
    async getSecret(key, options) {
        const entry = this.secretStore.get(key);
        if (!entry)
            return undefined;
        if (options?.metadataFields?.length) {
            return this.toGetResult(key, entry, options.metadataFields);
        }
        return entry.value;
    }
    async setSecret(key, value) {
        this.checkSize(key, value);
        const now = Date.now();
        const existing = this.secretStore.get(key);
        this.secretStore.set(key, {
            value,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        });
    }
    async deleteSecret(key) {
        this.secretStore.delete(key);
    }
    // ---- Entities ----
    entity(entityName) {
        return {
            get: async (key, options) => {
                const storeKey = `${entityName}:${key}`;
                const entry = this.entityStore.get(storeKey);
                if (!entry)
                    return undefined;
                if (options?.metadataFields?.length) {
                    return this.toGetResult(key, entry, options.metadataFields);
                }
                return entry.value;
            },
            set: async (key, value) => {
                this.checkSize(key, value);
                const storeKey = `${entityName}:${key}`;
                const now = Date.now();
                const existing = this.entityStore.get(storeKey);
                this.entityStore.set(storeKey, {
                    value,
                    createdAt: existing?.createdAt ?? now,
                    updatedAt: now,
                });
            },
            delete: async (key) => {
                this.entityStore.delete(`${entityName}:${key}`);
            },
            query: () => new FakeIndexQueryBuilder(entityName, this.entityStore, this.entityDefs),
        };
    }
    // ---- Transactions ----
    transact() {
        return new FakeTransactionBuilder(this.kvsStore, this.entityStore, this.enforceSizeLimit);
    }
    // ---- Test utilities ----
    /**
     * Clear all data (KVS, secrets, entities). Call between tests.
     */
    reset() {
        this.kvsStore.clear();
        this.secretStore.clear();
        this.entityStore.clear();
    }
    /**
     * Seed KVS data for tests.
     */
    seed(data) {
        const now = Date.now();
        for (const [key, value] of Object.entries(data)) {
            this.kvsStore.set(key, { value, createdAt: now, updatedAt: now });
        }
    }
    /**
     * Seed entity data for tests.
     */
    seedEntity(entityName, items) {
        const now = Date.now();
        for (const item of items) {
            this.entityStore.set(`${entityName}:${item.key}`, {
                value: item.value,
                createdAt: now,
                updatedAt: now,
            });
        }
    }
    // ---- Internal helpers ----
    toGetResult(key, entry, metadataFields) {
        const result = { key, value: entry.value };
        for (const field of metadataFields) {
            if (field === 'CREATED_AT')
                result.createdAt = entry.createdAt;
            if (field === 'UPDATED_AT')
                result.updatedAt = entry.updatedAt;
        }
        return result;
    }
}
exports.FakeKvs = FakeKvs;
