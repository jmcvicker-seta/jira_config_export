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
export { createMockContext, createMockResolverContext } from '../generated/registry.js';
