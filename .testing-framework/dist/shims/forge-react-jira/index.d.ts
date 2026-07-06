/**
 * Fake implementation of @forge/react/jira.
 *
 * Provides stub components for Jira-specific Forge UI components so frontend
 * code that imports from @forge/react/jira can be loaded and tested in a
 * Jest/jsdom environment without the real Forge runtime.
 *
 * Components are simple React pass-through elements that render their children.
 * Non-DOM props are converted to data-* attributes for test assertions, matching
 * the behaviour of the main @forge/react shim.
 *
 * Usage:
 *   In jest.config.cjs moduleNameMapper:
 *     '^@forge/react/jira$': '<rootDir>/.testing-framework/dist/shims/forge-react-jira/index.js'
 */
import React from 'react';
type StubProps = Record<string, unknown> & {
    children?: React.ReactNode;
};
export declare const CustomFieldEdit: React.FC<StubProps>;
export {};
