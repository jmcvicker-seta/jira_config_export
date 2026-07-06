"use strict";
/**
 * Factory functions for creating mock Forge contexts.
 *
 * Two factory functions are provided for the two different context shapes in Forge:
 *
 * - `createMockContext()` — **Frontend** contexts (useProductContext / view.getContext).
 *   Use when testing UI Kit or Custom UI code.
 *
 * - `createMockResolverContext()` — **Backend** contexts (req.context in resolvers).
 *   Use when testing resolvers, function handlers, or any server-side Forge code.
 *
 * Both return the same module-specific extension data; they differ only in the
 * envelope fields that wrap the extension.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResolverContext = exports.createMockContext = void 0;
var registry_js_1 = require("../generated/registry.js");
Object.defineProperty(exports, "createMockContext", { enumerable: true, get: function () { return registry_js_1.createMockContext; } });
Object.defineProperty(exports, "createMockResolverContext", { enumerable: true, get: function () { return registry_js_1.createMockResolverContext; } });
