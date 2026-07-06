import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
// Components that should not be empty
const COMPONENTS_REQUIRING_CONTENT = new Set([
    'Text',
    'Heading',
    'Button',
    'Box',
    'Stack',
    'Inline',
]);
// Components that can be self-closing/empty
const SELF_CLOSING_COMPONENTS = new Set([
    'Spinner',
    'Image',
    'Icon',
    'Textfield',
    'Textarea',
    'Select',
    'Toggle',
    'Range',
    'DatePicker',
    'TimePicker',
    'Calendar',
    'ProgressBar',
    'ProgressTracker',
]);
// Components with required props that make them valid even without children
const COMPONENTS_WITH_REQUIRED_PROPS = new Map([
    ['RadioGroup', ['name', 'options']],
    ['UserPicker', ['name']],
    ['DynamicTable', ['head', 'rows']],
]);
function isEmptyJSXElement(node) {
    return node.children.length === 0;
}
function isForgeComponent(node) {
    if (node.openingElement.name.type !== 'JSXIdentifier') {
        return false;
    }
    const componentName = node.openingElement.name.name;
    return (COMPONENTS_REQUIRING_CONTENT.has(componentName) ||
        SELF_CLOSING_COMPONENTS.has(componentName) ||
        COMPONENTS_WITH_REQUIRED_PROPS.has(componentName));
}
function getComponentName(node) {
    if (node.openingElement.name.type === 'JSXIdentifier') {
        return node.openingElement.name.name;
    }
    return '';
}
function hasRequiredProps(node, requiredProps) {
    const propNames = node.openingElement.attributes
        .filter((attr) => attr.type === 'JSXAttribute')
        .map((attr) => attr.name.type === 'JSXIdentifier' ? attr.name.name : '')
        .filter((name) => name !== '');
    return requiredProps.every((required) => propNames.includes(required));
}
function hasOnlySpacingProps(node) {
    const spacingProps = new Set([
        'space',
        'rowSpace',
        'alignInline',
        'alignBlock',
        'spread',
        'shouldWrap',
        'separator',
        'grow',
    ]);
    const propNames = node.openingElement.attributes
        .filter((attr) => attr.type === 'JSXAttribute')
        .map((attr) => attr.name.type === 'JSXIdentifier' ? attr.name.name : '')
        .filter((name) => name !== '');
    return (propNames.length > 0 &&
        propNames.every((prop) => spacingProps.has(prop) || prop === 'testId'));
}
export const noEmptyComponents = createRule({
    name: 'no-empty-components',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow empty Forge UI Kit components that require content',
        },
        fixable: 'code',
        schema: [],
        messages: {
            emptyText: 'Empty Text component. Text components must have content.',
            emptyHeading: 'Empty Heading component. Heading components must have content.',
            emptyButton: 'Empty Button component. Button components must have content.',
            emptyBox: 'Empty Box component. Remove empty Box or add meaningful content.',
            emptyStack: 'Empty Stack component with only spacing props. Stack needs children or should be removed.',
            emptyInline: 'Empty Inline component with only spacing props. Inline needs children or should be removed.',
            emptyComponent: 'Empty {{componentName}} component. This component requires content or should be removed.',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                if (!isForgeComponent(node) || !isEmptyJSXElement(node)) {
                    return;
                }
                const componentName = getComponentName(node);
                // Skip if it's a self-closing component (those are OK to be empty)
                if (SELF_CLOSING_COMPONENTS.has(componentName)) {
                    return;
                }
                // Check components with required props
                const requiredProps = COMPONENTS_WITH_REQUIRED_PROPS.get(componentName);
                if (requiredProps && hasRequiredProps(node, requiredProps)) {
                    return; // Valid because it has required props
                }
                // Special handling for layout components that might only have spacing props
                if ((componentName === 'Stack' || componentName === 'Inline') &&
                    hasOnlySpacingProps(node)) {
                    context.report({
                        node,
                        messageId: componentName === 'Stack' ? 'emptyStack' : 'emptyInline',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
                // Report based on component type
                const messageMap = {
                    Text: 'emptyText',
                    Heading: 'emptyHeading',
                    Button: 'emptyButton',
                    Box: 'emptyBox',
                };
                const messageId = messageMap[componentName] || 'emptyComponent';
                // Only add data for generic emptyComponent messages
                if (messageId === 'emptyComponent') {
                    context.report({
                        node,
                        messageId,
                        data: { componentName },
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                }
                else {
                    context.report({
                        node,
                        messageId,
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                }
            },
        };
    },
});
