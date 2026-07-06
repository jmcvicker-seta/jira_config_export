import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
export const noFormLabelProp = createRule({
    name: 'no-form-label-prop',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow label props on form components that should use separate Label components',
            url: 'https://developer.atlassian.com/platform/forge/ui-kit',
        },
        fixable: 'code',
        messages: {
            noLabelProp: '{{componentName}} must not use "label" prop. Use a separate <Label> component instead.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        // Form components that should not have label props
        const FORM_COMPONENTS_NO_LABEL = new Set([
            'Textfield',
            'TextArea',
            'Select',
            'DatePicker',
            'TimePicker',
            'Range',
        ]);
        return {
            JSXElement(node) {
                if (node.openingElement?.type !== 'JSXOpeningElement')
                    return;
                const elementName = node.openingElement.name;
                if (elementName?.type !== 'JSXIdentifier')
                    return;
                const componentName = elementName.name;
                // Only check form components that shouldn't have label props
                if (!FORM_COMPONENTS_NO_LABEL.has(componentName))
                    return;
                const attributes = node.openingElement.attributes;
                // Check for label prop
                const hasLabelProp = attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'label');
                if (hasLabelProp) {
                    context.report({
                        node,
                        messageId: 'noLabelProp',
                        data: { componentName },
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                }
            },
        };
    },
});
