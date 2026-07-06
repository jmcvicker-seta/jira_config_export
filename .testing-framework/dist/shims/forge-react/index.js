"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = exports.Textfield = exports.RequiredAsterisk = exports.ValidMessage = exports.ErrorMessage = exports.HelperMessage = exports.Label = exports.FormFooter = exports.FormSection = exports.FormHeader = exports.Form = exports.ListItem = exports.List = exports.AdfRenderer = exports.Frame = exports.Tile = exports.UserGroup = exports.User = exports.Icon = exports.Image = exports.DynamicTable = exports.EmptyState = exports.Tooltip = exports.TagGroup = exports.Tag = exports.ProgressTracker = exports.ProgressBar = exports.Spinner = exports.SectionMessageAction = exports.SectionMessage = exports.Lozenge = exports.Badge = exports.Strong = exports.Strike = exports.Em = exports.Comment = exports.CodeBlock = exports.Code = exports.Heading = exports.Text = exports.LoadingButton = exports.LinkButton = exports.Link = exports.ButtonGroup = exports.Button = exports.Bleed = exports.Pressable = exports.Inline = exports.Stack = exports.Box = void 0;
exports.useForm = exports.useTranslation = exports.useIssueProperty = exports.useSpaceProperty = exports.useContentProperty = exports.useConfig = exports.useProductContext = exports.I18nProvider = exports.FilePicker = exports.FileCard = exports.ChromelessEditor = exports.CommentEditor = exports.Calendar = exports.StackBarChart = exports.PieChart = exports.LineChart = exports.HorizontalStackBarChart = exports.HorizontalBarChart = exports.DonutChart = exports.BarChart = exports.Popup = exports.ModalTransition = exports.ModalTitle = exports.ModalHeader = exports.ModalFooter = exports.ModalBody = exports.Modal = exports.Pagination = exports.BreadcrumbsItem = exports.Breadcrumbs = exports.TabPanel = exports.TabList = exports.Tab = exports.Tabs = exports.InlineEdit = exports.UserPicker = exports.TimePicker = exports.DatePicker = exports.Range = exports.Toggle = exports.RadioGroup = exports.Radio = exports.CheckboxGroup = exports.Checkbox = exports.Select = void 0;
exports.setProductContext = setProductContext;
exports.xcss = xcss;
exports.replaceUnsupportedDocumentNodes = replaceUnsupportedDocumentNodes;
exports.resetForgeReactShim = resetForgeReactShim;
const react_1 = __importDefault(require("react"));
// --- Props sanitisation ---
/**
 * Set of props that are safe to pass directly to a DOM element.
 * Includes standard HTML attributes, React synthetic-event handlers,
 * and well-known React DOM props. Everything else is converted to a
 * `data-*` attribute so it remains queryable in tests without
 * triggering React's "unknown DOM property" warning.
 *
 * In tests:
 *   expect(screen.getByTestId('forge-button')).toHaveAttribute('data-isdisabled', 'true');
 *   expect(screen.getByTestId('forge-inline')).toHaveAttribute('data-aligninline', 'center');
 */
const SAFE_DOM_PROPS = new Set([
    // Core HTML attributes
    'className', 'id', 'style', 'title', 'role', 'tabIndex', 'dir', 'lang', 'hidden',
    'accessKey', 'draggable', 'spellCheck', 'translate', 'autoFocus', 'contentEditable',
    // ARIA (handled separately via prefix check)
    // data-* (handled separately via prefix check)
    // Form-related
    'name', 'value', 'type', 'placeholder', 'disabled', 'checked', 'readOnly',
    'required', 'autoComplete', 'min', 'max', 'step', 'pattern', 'maxLength',
    'minLength', 'multiple', 'size', 'form', 'formAction', 'formMethod',
    // Media
    'src', 'alt', 'width', 'height', 'href', 'target', 'rel',
    // Table
    'colSpan', 'rowSpan', 'scope', 'headers',
]);
/**
 * Returns true if a prop key is safe to pass directly to a DOM element.
 */
function isSafeDomProp(key) {
    if (SAFE_DOM_PROPS.has(key))
        return true;
    // data-* and aria-* attributes are always safe
    if (key.startsWith('data-') || key.startsWith('aria-'))
        return true;
    // React event handlers (onClick, onChange, etc.)
    if (/^on[A-Z]/.test(key))
        return true;
    return false;
}
/**
 * Separates props into safe DOM props and data-* attributes.
 * Props that are not valid DOM attributes are converted to lowercase
 * `data-*` attributes (e.g., isDisabled → data-isdisabled) so they
 * remain queryable in tests via getAttribute() or toHaveAttribute().
 */
function sanitiseProps(props) {
    const result = {};
    for (const [key, value] of Object.entries(props)) {
        if (key === 'testId') {
            // Forge convention: testId maps directly to data-testid
            result['data-testid'] = String(value);
        }
        else if (isSafeDomProp(key)) {
            result[key] = value;
        }
        else {
            // Skip undefined/null values (matching real Forge behaviour — unset props are omitted)
            if (value == null)
                continue;
            // Convert to data-* attribute for testability
            result[`data-${key.toLowerCase()}`] = typeof value === 'object' ? JSON.stringify(value) : String(value);
        }
    }
    return result;
}
// --- Component factory ---
/**
 * Props commonly used by UI Kit components to render visible text content.
 * When a stub component receives one of these as a plain string, the value
 * is also rendered as a <span> inside the component so test queries like
 * `screen.getByText('My header')` succeed — the original `data-*` attribute
 * is still set for back-compat.
 *
 * Examples:
 *   <EmptyState header="No results" /> → renders the text "No results"
 *   <SectionMessage title="Heads up" /> → renders the text "Heads up"
 *   <Badge text="3" /> → renders the text "3"
 *
 * `content` is intentionally NOT in this list because it's overloaded (e.g.
 * DynamicTable cells use `content` for a React node and handle it separately).
 */
const VISIBLE_TEXT_PROPS = ['header', 'title', 'description', 'text', 'label'];
/**
 * Build the visible-text <span> elements for any of the well-known text props
 * that were passed as plain strings. Returns null when there is nothing to render.
 */
function renderVisibleTextProps(displayName, props) {
    const elements = [];
    for (const propName of VISIBLE_TEXT_PROPS) {
        const value = props[propName];
        if (typeof value !== 'string' || value.length === 0)
            continue;
        elements.push(react_1.default.createElement('span', {
            key: `forge-text-${propName}`,
            'data-testid': `forge-${displayName.toLowerCase()}-${propName}`,
        }, value));
    }
    return elements.length > 0 ? elements : null;
}
/**
 * Creates a stub React component that renders its children inside a div
 * with a data-testid attribute for easy querying in tests.
 * Non-DOM props are converted to data-* attributes for testability.
 * Well-known text props (header/title/description/text/label) are also
 * rendered as visible <span>s so `screen.getByText(...)` works.
 */
function createStubComponent(displayName) {
    const Component = ({ children, ...rest }) => {
        const visibleText = renderVisibleTextProps(displayName, rest);
        return react_1.default.createElement('div', {
            'data-testid': `forge-${displayName.toLowerCase()}`,
            ...sanitiseProps(rest),
        }, visibleText, children);
    };
    Component.displayName = displayName;
    return Component;
}
/**
 * Creates a stub component for leaf components (Spinner, Textfield, Select, etc.).
 * Non-DOM props are converted to data-* attributes for testability.
 * Well-known text props (header/title/description/text/label) are also
 * rendered as visible <span>s so `screen.getByText(...)` works.
 */
function createLeafComponent(displayName) {
    const Component = ({ children: _children, ...rest }) => {
        const visibleText = renderVisibleTextProps(displayName, rest);
        return react_1.default.createElement('div', {
            'data-testid': `forge-${displayName.toLowerCase()}`,
            ...sanitiseProps(rest),
        }, visibleText);
    };
    Component.displayName = displayName;
    return Component;
}
// --- Primitives / Layout ---
exports.Box = createStubComponent('Box');
exports.Stack = createStubComponent('Stack');
exports.Inline = createStubComponent('Inline');
exports.Pressable = createStubComponent('Pressable');
exports.Bleed = createStubComponent('Bleed');
// --- Action ---
exports.Button = createStubComponent('Button');
exports.ButtonGroup = createStubComponent('ButtonGroup');
exports.Link = createStubComponent('Link');
exports.LinkButton = createStubComponent('LinkButton');
exports.LoadingButton = createStubComponent('LoadingButton');
// --- Typography / Content ---
exports.Text = createStubComponent('Text');
exports.Heading = createStubComponent('Heading');
exports.Code = createStubComponent('Code');
exports.CodeBlock = createStubComponent('CodeBlock');
exports.Comment = createStubComponent('Comment');
exports.Em = createStubComponent('Em');
exports.Strike = createStubComponent('Strike');
exports.Strong = createStubComponent('Strong');
// --- Feedback ---
exports.Badge = createStubComponent('Badge');
exports.Lozenge = createStubComponent('Lozenge');
exports.SectionMessage = createStubComponent('SectionMessage');
exports.SectionMessageAction = createStubComponent('SectionMessageAction');
exports.Spinner = createLeafComponent('Spinner');
exports.ProgressBar = createLeafComponent('ProgressBar');
exports.ProgressTracker = createStubComponent('ProgressTracker');
exports.Tag = createStubComponent('Tag');
exports.TagGroup = createStubComponent('TagGroup');
exports.Tooltip = createStubComponent('Tooltip');
exports.EmptyState = createStubComponent('EmptyState');
const DynamicTable = ({ head, rows, emptyView, children, ...rest }) => {
    const headCells = head?.cells?.map((cell, i) => react_1.default.createElement('div', { key: `head-${cell.key ?? i}`, 'data-testid': 'forge-dynamictable-head-cell' }, cell.content));
    const rowElements = rows?.map((row, ri) => react_1.default.createElement('div', { key: row.key ?? `row-${ri}`, 'data-testid': 'forge-dynamictable-row' }, row.cells?.map((cell, ci) => react_1.default.createElement('div', { key: cell.key ?? `cell-${ci}`, 'data-testid': 'forge-dynamictable-cell' }, cell.content))));
    const hasRows = rows && rows.length > 0;
    return react_1.default.createElement('div', { 'data-testid': 'forge-dynamictable', ...sanitiseProps(rest) }, headCells, hasRows ? rowElements : emptyView, children);
};
exports.DynamicTable = DynamicTable;
DynamicTable.displayName = 'DynamicTable';
exports.Image = createLeafComponent('Image');
exports.Icon = createLeafComponent('Icon');
exports.User = createLeafComponent('User');
exports.UserGroup = createStubComponent('UserGroup');
exports.Tile = createStubComponent('Tile');
exports.Frame = createStubComponent('Frame');
exports.AdfRenderer = createStubComponent('AdfRenderer');
exports.List = createStubComponent('List');
exports.ListItem = createStubComponent('ListItem');
// --- Form ---
exports.Form = createStubComponent('Form');
exports.FormHeader = createStubComponent('FormHeader');
exports.FormSection = createStubComponent('FormSection');
exports.FormFooter = createStubComponent('FormFooter');
exports.Label = createStubComponent('Label');
exports.HelperMessage = createStubComponent('HelperMessage');
exports.ErrorMessage = createStubComponent('ErrorMessage');
exports.ValidMessage = createStubComponent('ValidMessage');
exports.RequiredAsterisk = createLeafComponent('RequiredAsterisk');
exports.Textfield = createLeafComponent('Textfield');
exports.TextArea = createLeafComponent('TextArea');
exports.Select = createLeafComponent('Select');
exports.Checkbox = createLeafComponent('Checkbox');
exports.CheckboxGroup = createStubComponent('CheckboxGroup');
exports.Radio = createLeafComponent('Radio');
exports.RadioGroup = createLeafComponent('RadioGroup');
exports.Toggle = createLeafComponent('Toggle');
exports.Range = createLeafComponent('Range');
exports.DatePicker = createLeafComponent('DatePicker');
exports.TimePicker = createLeafComponent('TimePicker');
exports.UserPicker = createLeafComponent('UserPicker');
exports.InlineEdit = createStubComponent('InlineEdit');
// --- Navigation ---
exports.Tabs = createStubComponent('Tabs');
exports.Tab = createStubComponent('Tab');
exports.TabList = createStubComponent('TabList');
exports.TabPanel = createStubComponent('TabPanel');
exports.Breadcrumbs = createStubComponent('Breadcrumbs');
exports.BreadcrumbsItem = createStubComponent('BreadcrumbsItem');
exports.Pagination = createLeafComponent('Pagination');
// --- Overlay ---
exports.Modal = createStubComponent('Modal');
exports.ModalBody = createStubComponent('ModalBody');
exports.ModalFooter = createStubComponent('ModalFooter');
exports.ModalHeader = createStubComponent('ModalHeader');
exports.ModalTitle = createStubComponent('ModalTitle');
exports.ModalTransition = createStubComponent('ModalTransition');
exports.Popup = createStubComponent('Popup');
// --- Charts ---
exports.BarChart = createLeafComponent('BarChart');
exports.DonutChart = createLeafComponent('DonutChart');
exports.HorizontalBarChart = createLeafComponent('HorizontalBarChart');
exports.HorizontalStackBarChart = createLeafComponent('HorizontalStackBarChart');
exports.LineChart = createLeafComponent('LineChart');
exports.PieChart = createLeafComponent('PieChart');
exports.StackBarChart = createLeafComponent('StackBarChart');
// --- Calendar ---
exports.Calendar = createLeafComponent('Calendar');
// --- Comment Editor ---
exports.CommentEditor = createStubComponent('CommentEditor');
exports.ChromelessEditor = createStubComponent('ChromelessEditor');
// --- File components (EAP) ---
exports.FileCard = createLeafComponent('FileCard');
exports.FilePicker = createLeafComponent('FilePicker');
// --- i18n ---
exports.I18nProvider = createStubComponent('I18nProvider');
// --- Hooks ---
/**
 * Internal product context state. Updated by the @forge/bridge shim's
 * setContext()/mockGetContext() so that useProductContext() and
 * view.getContext() return the same data — mirroring the real Forge runtime.
 */
let _productContext = undefined;
/**
 * Set the product context returned by useProductContext().
 * Called internally by the @forge/bridge shim when setContext()/mockGetContext() is used.
 * Can also be called directly in tests if not using the bridge shim.
 */
function setProductContext(ctx) {
    _productContext = ctx;
}
/**
 * Returns the product context. In the real Forge runtime, this returns the
 * same context as view.getContext(). The bridge shim's setContext() keeps
 * both in sync automatically.
 */
const useProductContext = () => _productContext;
exports.useProductContext = useProductContext;
/**
 * Returns the config portion of the product context (extension.config).
 * In the real Forge runtime, useConfig() reads from the same context as
 * useProductContext(). Set config values via bridge.setContext():
 *
 *   bridge.setContext(createFrontendContext('confluence:macro', {
 *     extension: { config: { myField: 'value' } }
 *   }));
 */
const useConfig = () => {
    const ext = _productContext?.extension;
    return ext?.config ?? undefined;
};
exports.useConfig = useConfig;
function createPropertyHook(_name) {
    return (propertyKey, initValue) => [
        initValue,
        async () => { },
        async () => { },
    ];
}
exports.useContentProperty = createPropertyHook('useContentProperty');
exports.useSpaceProperty = createPropertyHook('useSpaceProperty');
exports.useIssueProperty = createPropertyHook('useIssueProperty');
const useTranslation = () => ({
    ready: true,
    t: (key) => key,
    locale: 'en',
});
exports.useTranslation = useTranslation;
const useForm = () => ({
    getFieldId: (name) => `field-${name}`,
    register: (name) => ({ name, id: `field-${name}` }),
    handleSubmit: (fn) => (_e) => fn({}),
});
exports.useForm = useForm;
// --- xcss ---
/**
 * Returns its input unchanged — allows test code to assert on style objects.
 */
function xcss(styles) {
    return styles;
}
// --- Utilities ---
/**
 * Stub for replaceUnsupportedDocumentNodes — returns the document unchanged.
 * In the real implementation this walks an ADF doc and replaces unsupported nodes.
 */
function replaceUnsupportedDocumentNodes(document, _replaceUnsupportedNode) {
    return document;
}
// --- ForgeReconciler ---
let _lastRendered = null;
let _lastConfig = null;
/**
 * Fake ForgeReconciler. Captures what was rendered for assertions.
 */
const ForgeReconciler = {
    render(element) {
        _lastRendered = element;
    },
    /**
     * Register a config panel element (used for Confluence macro config).
     */
    addConfig(element) {
        _lastConfig = element;
    },
    /**
     * Get the last element passed to ForgeReconciler.render().
     * Useful for test assertions.
     */
    getRendered() {
        return _lastRendered;
    },
    /**
     * Get the last element passed to ForgeReconciler.addConfig().
     * Useful for test assertions.
     */
    getConfig() {
        return _lastConfig;
    },
    /**
     * Reset the recorded render and config (call between tests).
     */
    resetRendered() {
        _lastRendered = null;
        _lastConfig = null;
    },
};
exports.default = ForgeReconciler;
// --- Reset function for test isolation ---
function resetForgeReactShim() {
    ForgeReconciler.resetRendered();
    _productContext = undefined;
}
