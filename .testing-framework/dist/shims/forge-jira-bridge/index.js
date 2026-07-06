"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.jiraBridge = exports._jiraBridge = exports.workflowRules = exports.uiModifications = exports.CreateIssueModal = exports.ViewIssueModal = void 0;
exports.resetForgeJiraBridgeShim = resetForgeJiraBridgeShim;
// --- Module-level recorder shared by all instances ---
class JiraBridgeRecorder {
    viewIssueModalOpens = [];
    createIssueModalOpens = [];
    uiModificationActions = [];
    workflowRuleActions = [];
    /**
     * Override the value returned by uiModifications.getFieldValue(fieldId).
     * Keyed by field id. Defaults to undefined.
     */
    fieldValues = new Map();
    setFieldValue(fieldId, value) {
        this.fieldValues.set(fieldId, value);
    }
    getFieldValue(fieldId) {
        return this.fieldValues.get(fieldId);
    }
    reset() {
        this.viewIssueModalOpens.length = 0;
        this.createIssueModalOpens.length = 0;
        this.uiModificationActions.length = 0;
        this.workflowRuleActions.length = 0;
        this.fieldValues.clear();
    }
}
const _jiraBridge = new JiraBridgeRecorder();
exports._jiraBridge = _jiraBridge;
exports.jiraBridge = _jiraBridge;
class ViewIssueModal {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    async open() {
        _jiraBridge.viewIssueModalOpens.push({
            issueKey: this.options.context?.issueKey,
            context: (this.options.context ?? {}),
            timestamp: Date.now(),
        });
    }
}
exports.ViewIssueModal = ViewIssueModal;
class CreateIssueModal {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    async open() {
        _jiraBridge.createIssueModalOpens.push({
            context: (this.options.context ?? {}),
            timestamp: Date.now(),
        });
    }
}
exports.CreateIssueModal = CreateIssueModal;
/**
 * Stub for `uiModifications` from @forge/jira-bridge.
 *
 * Real API methods include onInit, onChange, getFieldValue, setFieldValue,
 * setFieldProperty. Each is recorded for test assertions.
 */
exports.uiModifications = {
    onInit: (callback, _filter) => {
        _jiraBridge.uiModificationActions.push({ action: 'onInit', timestamp: Date.now() });
        // Invoke the callback synchronously so tests that rely on it run.
        // We deliberately do NOT catch errors here. The real @forge/jira-bridge
        // runtime catches and logs uncaught errors via its own pipeline, but in
        // a unit test an exception from onInit almost always means the test setup
        // or the component under test is broken — silently swallowing it would
        // produce a false-green run. Fail loud instead.
        void callback();
    },
    onChange: (_callback, filter) => {
        _jiraBridge.uiModificationActions.push({
            action: 'onChange',
            fieldId: filter?.fieldIds?.[0],
            timestamp: Date.now(),
        });
    },
    getFieldById: (fieldId) => ({
        getValue: async () => {
            _jiraBridge.uiModificationActions.push({
                action: 'getFieldValue',
                fieldId,
                timestamp: Date.now(),
            });
            return _jiraBridge.getFieldValue(fieldId);
        },
        setValue: async (value) => {
            _jiraBridge.uiModificationActions.push({
                action: 'setFieldValue',
                fieldId,
                payload: value,
                timestamp: Date.now(),
            });
            _jiraBridge.setFieldValue(fieldId, value);
        },
        setFieldProperty: async (propertyName, propertyValue) => {
            _jiraBridge.uiModificationActions.push({
                action: 'setFieldProperty',
                fieldId,
                payload: { propertyName, propertyValue },
                timestamp: Date.now(),
            });
        },
    }),
};
/**
 * Stub for `workflowRules` (EAP) from @forge/jira-bridge.
 *
 * Real API lets the app handle workflow validator/condition/post-function
 * configuration. The shim records onConfigure / onValidate / submit calls so
 * tests can assert on them.
 */
exports.workflowRules = {
    onConfigure: (callback) => {
        _jiraBridge.workflowRuleActions.push({ action: 'onConfigure', timestamp: Date.now() });
        // Deliberately not catching — see uiModifications.onInit for rationale.
        // Test authors should see real errors thrown by their config callback.
        void callback();
    },
    onValidate: (_callback) => {
        _jiraBridge.workflowRuleActions.push({ action: 'onValidate', timestamp: Date.now() });
    },
    submit: async (payload) => {
        _jiraBridge.workflowRuleActions.push({ action: 'submit', payload, timestamp: Date.now() });
    },
};
// --- Test helpers ---
/** Reset all recorded interactions. Call between tests. */
function resetForgeJiraBridgeShim() {
    _jiraBridge.reset();
}
