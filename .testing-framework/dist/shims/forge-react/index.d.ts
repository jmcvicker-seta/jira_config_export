/**
 * Fake implementation of @forge/react.
 *
 * Provides stub components and utilities so frontend code that imports
 * from @forge/react can be loaded and tested in a Jest/jsdom environment
 * without the real Forge runtime.
 *
 * Components are simple React pass-through elements that render their children.
 * ForgeReconciler.render() is a no-op that records what was rendered.
 * xcss() returns its input for test assertions.
 *
 * Usage:
 *   In jest.config.cjs moduleNameMapper:
 *     '^@forge/react$': '<rootDir>/.testing-framework/dist/shims/forge-react/index.js'
 *
 *   Then in tests, @forge/react imports resolve to these stubs automatically.
 */
import React from 'react';
type StubProps = Record<string, unknown> & {
    children?: React.ReactNode;
};
export declare const Box: React.FC<StubProps>;
export declare const Stack: React.FC<StubProps>;
export declare const Inline: React.FC<StubProps>;
export declare const Pressable: React.FC<StubProps>;
export declare const Bleed: React.FC<StubProps>;
export declare const Button: React.FC<StubProps>;
export declare const ButtonGroup: React.FC<StubProps>;
export declare const Link: React.FC<StubProps>;
export declare const LinkButton: React.FC<StubProps>;
export declare const LoadingButton: React.FC<StubProps>;
export declare const Text: React.FC<StubProps>;
export declare const Heading: React.FC<StubProps>;
export declare const Code: React.FC<StubProps>;
export declare const CodeBlock: React.FC<StubProps>;
export declare const Comment: React.FC<StubProps>;
export declare const Em: React.FC<StubProps>;
export declare const Strike: React.FC<StubProps>;
export declare const Strong: React.FC<StubProps>;
export declare const Badge: React.FC<StubProps>;
export declare const Lozenge: React.FC<StubProps>;
export declare const SectionMessage: React.FC<StubProps>;
export declare const SectionMessageAction: React.FC<StubProps>;
export declare const Spinner: React.FC<StubProps>;
export declare const ProgressBar: React.FC<StubProps>;
export declare const ProgressTracker: React.FC<StubProps>;
export declare const Tag: React.FC<StubProps>;
export declare const TagGroup: React.FC<StubProps>;
export declare const Tooltip: React.FC<StubProps>;
export declare const EmptyState: React.FC<StubProps>;
/**
 * Custom DynamicTable stub that renders head and row cell content.
 * Unlike the generic stub, DynamicTable receives its data via `head` and `rows`
 * props (not children), with each cell having a `content` property.
 * This stub renders that content so tests can query it with getByText() etc.
 */
interface DynamicTableCell {
    content?: React.ReactNode;
    key?: string | number;
    [k: string]: unknown;
}
interface DynamicTableHead {
    cells?: DynamicTableCell[];
    [k: string]: unknown;
}
interface DynamicTableRow {
    cells?: DynamicTableCell[];
    key?: string;
    [k: string]: unknown;
}
interface DynamicTableProps extends Record<string, unknown> {
    head?: DynamicTableHead;
    rows?: DynamicTableRow[];
    emptyView?: React.ReactNode;
    children?: React.ReactNode;
}
declare const DynamicTable: React.FC<DynamicTableProps>;
export { DynamicTable };
export declare const Image: React.FC<StubProps>;
export declare const Icon: React.FC<StubProps>;
export declare const User: React.FC<StubProps>;
export declare const UserGroup: React.FC<StubProps>;
export declare const Tile: React.FC<StubProps>;
export declare const Frame: React.FC<StubProps>;
export declare const AdfRenderer: React.FC<StubProps>;
export declare const List: React.FC<StubProps>;
export declare const ListItem: React.FC<StubProps>;
export declare const Form: React.FC<StubProps>;
export declare const FormHeader: React.FC<StubProps>;
export declare const FormSection: React.FC<StubProps>;
export declare const FormFooter: React.FC<StubProps>;
export declare const Label: React.FC<StubProps>;
export declare const HelperMessage: React.FC<StubProps>;
export declare const ErrorMessage: React.FC<StubProps>;
export declare const ValidMessage: React.FC<StubProps>;
export declare const RequiredAsterisk: React.FC<StubProps>;
export declare const Textfield: React.FC<StubProps>;
export declare const TextArea: React.FC<StubProps>;
export declare const Select: React.FC<StubProps>;
export declare const Checkbox: React.FC<StubProps>;
export declare const CheckboxGroup: React.FC<StubProps>;
export declare const Radio: React.FC<StubProps>;
export declare const RadioGroup: React.FC<StubProps>;
export declare const Toggle: React.FC<StubProps>;
export declare const Range: React.FC<StubProps>;
export declare const DatePicker: React.FC<StubProps>;
export declare const TimePicker: React.FC<StubProps>;
export declare const UserPicker: React.FC<StubProps>;
export declare const InlineEdit: React.FC<StubProps>;
export declare const Tabs: React.FC<StubProps>;
export declare const Tab: React.FC<StubProps>;
export declare const TabList: React.FC<StubProps>;
export declare const TabPanel: React.FC<StubProps>;
export declare const Breadcrumbs: React.FC<StubProps>;
export declare const BreadcrumbsItem: React.FC<StubProps>;
export declare const Pagination: React.FC<StubProps>;
export declare const Modal: React.FC<StubProps>;
export declare const ModalBody: React.FC<StubProps>;
export declare const ModalFooter: React.FC<StubProps>;
export declare const ModalHeader: React.FC<StubProps>;
export declare const ModalTitle: React.FC<StubProps>;
export declare const ModalTransition: React.FC<StubProps>;
export declare const Popup: React.FC<StubProps>;
export declare const BarChart: React.FC<StubProps>;
export declare const DonutChart: React.FC<StubProps>;
export declare const HorizontalBarChart: React.FC<StubProps>;
export declare const HorizontalStackBarChart: React.FC<StubProps>;
export declare const LineChart: React.FC<StubProps>;
export declare const PieChart: React.FC<StubProps>;
export declare const StackBarChart: React.FC<StubProps>;
export declare const Calendar: React.FC<StubProps>;
export declare const CommentEditor: React.FC<StubProps>;
export declare const ChromelessEditor: React.FC<StubProps>;
export declare const FileCard: React.FC<StubProps>;
export declare const FilePicker: React.FC<StubProps>;
export declare const I18nProvider: React.FC<StubProps>;
/**
 * Set the product context returned by useProductContext().
 * Called internally by the @forge/bridge shim when setContext()/mockGetContext() is used.
 * Can also be called directly in tests if not using the bridge shim.
 */
export declare function setProductContext(ctx: Record<string, unknown> | undefined): void;
/**
 * Returns the product context. In the real Forge runtime, this returns the
 * same context as view.getContext(). The bridge shim's setContext() keeps
 * both in sync automatically.
 */
export declare const useProductContext: () => Record<string, unknown> | undefined;
/**
 * Returns the config portion of the product context (extension.config).
 * In the real Forge runtime, useConfig() reads from the same context as
 * useProductContext(). Set config values via bridge.setContext():
 *
 *   bridge.setContext(createFrontendContext('confluence:macro', {
 *     extension: { config: { myField: 'value' } }
 *   }));
 */
export declare const useConfig: () => unknown;
type PropertyHookReturn<T> = readonly [
    T | undefined,
    (valueUpdate: T | ((prev: T | undefined) => T), retryCount?: number) => Promise<void>,
    () => Promise<void>
];
export declare const useContentProperty: (propertyKey: string, initValue: unknown) => PropertyHookReturn<unknown>;
export declare const useSpaceProperty: (propertyKey: string, initValue: unknown) => PropertyHookReturn<unknown>;
export declare const useIssueProperty: (propertyKey: string, initValue: unknown) => PropertyHookReturn<unknown>;
export declare const useTranslation: () => {
    ready: boolean;
    t: (key: string) => string;
    locale: string;
};
export declare const useForm: () => {
    getFieldId: (name: string) => string;
    register: (name: string, options?: Record<string, unknown>) => Record<string, unknown>;
    handleSubmit: (fn: (data: unknown) => void) => (_e?: unknown) => void;
};
/**
 * Returns its input unchanged — allows test code to assert on style objects.
 */
export declare function xcss(styles: Record<string, unknown>): Record<string, unknown>;
/**
 * Stub for replaceUnsupportedDocumentNodes — returns the document unchanged.
 * In the real implementation this walks an ADF doc and replaces unsupported nodes.
 */
export declare function replaceUnsupportedDocumentNodes(document: Record<string, unknown>, _replaceUnsupportedNode: (node: Record<string, unknown>) => Record<string, unknown>): Record<string, unknown>;
/**
 * Fake ForgeReconciler. Captures what was rendered for assertions.
 */
declare const ForgeReconciler: {
    render(element: React.ReactNode): void;
    /**
     * Register a config panel element (used for Confluence macro config).
     */
    addConfig(element: React.ReactNode): void;
    /**
     * Get the last element passed to ForgeReconciler.render().
     * Useful for test assertions.
     */
    getRendered(): React.ReactNode;
    /**
     * Get the last element passed to ForgeReconciler.addConfig().
     * Useful for test assertions.
     */
    getConfig(): React.ReactNode;
    /**
     * Reset the recorded render and config (call between tests).
     */
    resetRendered(): void;
};
export default ForgeReconciler;
export declare function resetForgeReactShim(): void;
