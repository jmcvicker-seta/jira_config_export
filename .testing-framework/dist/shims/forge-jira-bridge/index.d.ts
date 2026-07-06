/**
 * Fake implementation of @forge/jira-bridge.
 *
 * The real @forge/jira-bridge package provides a JavaScript API for UI Kit and
 * Custom UI apps to securely integrate with Jira. It exports:
 *   - ViewIssueModal    — class with open() to show the issue view modal
 *   - CreateIssueModal  — class with open() to show the create-issue modal
 *   - uiModifications   — object for Jira UI Modifications (onInit, onChange, etc.)
 *   - workflowRules     — EAP API for Jira workflow validators/conditions/post-functions
 *
 * The package ships a `browser` entrypoint that Jest's Node resolver can't
 * resolve, so importing it in tests fails before this shim is mapped via
 * moduleNameMapper. This shim provides spyable no-op implementations so unit
 * tests can render and exercise components that import from @forge/jira-bridge
 * without needing the real Forge runtime.
 *
 * Usage in tests:
 *   import { jiraBridge } from '@forge/testing-framework';
 *
 *   const modal = new ViewIssueModal({ context: { issueKey: 'TEST-1' } });
 *   await modal.open();
 *
 *   expect(jiraBridge.viewIssueModalOpens).toHaveLength(1);
 *   expect(jiraBridge.viewIssueModalOpens[0].issueKey).toBe('TEST-1');
 */
export interface RecordedViewIssueModalOpen {
    issueKey?: string;
    context: Record<string, unknown>;
    timestamp: number;
}
export interface RecordedCreateIssueModalOpen {
    context: Record<string, unknown>;
    timestamp: number;
}
export interface RecordedUiModificationAction {
    action: 'onInit' | 'onChange' | 'setFieldValue' | 'getFieldValue' | 'setFieldProperty';
    fieldId?: string;
    payload?: unknown;
    timestamp: number;
}
export interface RecordedWorkflowRuleAction {
    action: 'onConfigure' | 'onValidate' | 'submit';
    payload?: unknown;
    timestamp: number;
}
declare class JiraBridgeRecorder {
    readonly viewIssueModalOpens: RecordedViewIssueModalOpen[];
    readonly createIssueModalOpens: RecordedCreateIssueModalOpen[];
    readonly uiModificationActions: RecordedUiModificationAction[];
    readonly workflowRuleActions: RecordedWorkflowRuleAction[];
    /**
     * Override the value returned by uiModifications.getFieldValue(fieldId).
     * Keyed by field id. Defaults to undefined.
     */
    private fieldValues;
    setFieldValue(fieldId: string, value: unknown): void;
    getFieldValue(fieldId: string): unknown;
    reset(): void;
}
declare const _jiraBridge: JiraBridgeRecorder;
export interface ViewIssueModalOptions {
    context?: {
        issueKey?: string;
        [key: string]: unknown;
    };
    onClose?: (payload?: unknown) => void;
    size?: string;
}
export declare class ViewIssueModal {
    private options;
    constructor(options?: ViewIssueModalOptions);
    open(): Promise<void>;
}
export interface CreateIssueModalOptions {
    context?: {
        projectKey?: string;
        issueTypeId?: string;
        [key: string]: unknown;
    };
    onClose?: (payload?: unknown) => void;
    size?: string;
}
export declare class CreateIssueModal {
    private options;
    constructor(options?: CreateIssueModalOptions);
    open(): Promise<void>;
}
/**
 * Stub for `uiModifications` from @forge/jira-bridge.
 *
 * Real API methods include onInit, onChange, getFieldValue, setFieldValue,
 * setFieldProperty. Each is recorded for test assertions.
 */
export declare const uiModifications: {
    onInit: (callback: () => unknown | Promise<unknown>, _filter?: {
        fieldIds?: string[];
    }) => void;
    onChange: (_callback: (event: {
        current: unknown;
        previous: unknown;
    }) => unknown, filter?: {
        fieldIds?: string[];
    }) => void;
    getFieldById: (fieldId: string) => {
        getValue: () => Promise<unknown>;
        setValue: (value: unknown) => Promise<void>;
        setFieldProperty: (propertyName: string, propertyValue: unknown) => Promise<void>;
    };
};
/**
 * Stub for `workflowRules` (EAP) from @forge/jira-bridge.
 *
 * Real API lets the app handle workflow validator/condition/post-function
 * configuration. The shim records onConfigure / onValidate / submit calls so
 * tests can assert on them.
 */
export declare const workflowRules: {
    onConfigure: (callback: () => unknown | Promise<unknown>) => void;
    onValidate: (_callback: (payload: unknown) => unknown | Promise<unknown>) => void;
    submit: (payload?: unknown) => Promise<void>;
};
/** Reset all recorded interactions. Call between tests. */
declare function resetForgeJiraBridgeShim(): void;
export { _jiraBridge, _jiraBridge as jiraBridge, resetForgeJiraBridgeShim };
