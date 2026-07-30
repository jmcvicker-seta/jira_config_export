"use strict";
/**
 * Drop-in replacement for @forge/kvs.
 *
 * When Jest/Vitest maps `@forge/kvs` to this module, app code like:
 *   import { kvs } from '@forge/kvs';
 * gets the fake implementation below.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._kvs = exports.Sort = exports.MetadataField = exports.applyCursorPagination = exports.sortByKey = exports.evaluateFilterClause = exports.evaluateWhereClause = exports.ForgeKvsAPIError = exports.ForgeKvsError = exports.FilterConditions = exports.WhereConditions = exports.KVS_PER_KEY_CHAR_LIMIT = exports.FakeKvs = exports.kvs = void 0;
exports.resetForgeKvsShim = resetForgeKvsShim;
const fake_kvs_js_1 = require("./fake-kvs.js");
// --- Singleton instance ---
const _kvs = new fake_kvs_js_1.FakeKvs();
exports._kvs = _kvs;
function resetForgeKvsShim() {
    _kvs.reset();
}
// Default export
exports.default = _kvs;
// Named export matching @forge/kvs API
exports.kvs = _kvs;
// --- Framework-specific exports ---
var fake_kvs_js_2 = require("./fake-kvs.js");
Object.defineProperty(exports, "FakeKvs", { enumerable: true, get: function () { return fake_kvs_js_2.FakeKvs; } });
Object.defineProperty(exports, "KVS_PER_KEY_CHAR_LIMIT", { enumerable: true, get: function () { return fake_kvs_js_2.KVS_PER_KEY_CHAR_LIMIT; } });
var conditions_js_1 = require("./conditions.js");
Object.defineProperty(exports, "WhereConditions", { enumerable: true, get: function () { return conditions_js_1.WhereConditions; } });
Object.defineProperty(exports, "FilterConditions", { enumerable: true, get: function () { return conditions_js_1.FilterConditions; } });
var errors_js_1 = require("./errors.js");
Object.defineProperty(exports, "ForgeKvsError", { enumerable: true, get: function () { return errors_js_1.ForgeKvsError; } });
Object.defineProperty(exports, "ForgeKvsAPIError", { enumerable: true, get: function () { return errors_js_1.ForgeKvsAPIError; } });
var query_evaluator_js_1 = require("./query-evaluator.js");
Object.defineProperty(exports, "evaluateWhereClause", { enumerable: true, get: function () { return query_evaluator_js_1.evaluateWhereClause; } });
Object.defineProperty(exports, "evaluateFilterClause", { enumerable: true, get: function () { return query_evaluator_js_1.evaluateFilterClause; } });
Object.defineProperty(exports, "sortByKey", { enumerable: true, get: function () { return query_evaluator_js_1.sortByKey; } });
Object.defineProperty(exports, "applyCursorPagination", { enumerable: true, get: function () { return query_evaluator_js_1.applyCursorPagination; } });
var types_js_1 = require("./types.js");
Object.defineProperty(exports, "MetadataField", { enumerable: true, get: function () { return types_js_1.MetadataField; } });
Object.defineProperty(exports, "Sort", { enumerable: true, get: function () { return types_js_1.Sort; } });
