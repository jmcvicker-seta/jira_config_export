"use strict";
/**
 * TypeScript type definitions for Forge module contexts
 *
 * This file provides a comprehensive set of TypeScript types for all Forge module contexts.
 * Types are organized into:
 * - Common/shared types used across modules
 * - Individual module context types (re-exported from modules/)
 * - ProductContext (the full useProductContext() return type)
 * - Utility types and helpers
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultResolverEnvelope = exports.createDefaultEnvelope = void 0;
var product_context_js_1 = require("./product-context.js");
Object.defineProperty(exports, "createDefaultEnvelope", { enumerable: true, get: function () { return product_context_js_1.createDefaultEnvelope; } });
Object.defineProperty(exports, "createDefaultResolverEnvelope", { enumerable: true, get: function () { return product_context_js_1.createDefaultResolverEnvelope; } });
// Re-export all individual module context types
__exportStar(require("./modules/index.js"), exports);
