"use strict";
/**
 * Types matching @forge/kvs's public API surface.
 *
 * These are re-declared here so the shim has no runtime dependency on @forge/kvs.
 * They match @forge/kvs v1.2.6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = exports.MetadataField = void 0;
// --- Result types ---
var MetadataField;
(function (MetadataField) {
    MetadataField["CREATED_AT"] = "CREATED_AT";
    MetadataField["UPDATED_AT"] = "UPDATED_AT";
})(MetadataField || (exports.MetadataField = MetadataField = {}));
// --- Sort ---
var Sort;
(function (Sort) {
    Sort["ASC"] = "ASC";
    Sort["DESC"] = "DESC";
})(Sort || (exports.Sort = Sort = {}));
