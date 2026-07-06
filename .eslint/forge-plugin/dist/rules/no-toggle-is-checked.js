import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
export const noToggleIsChecked = createRule({
    name: 'no-toggle-is-checked',
    meta: {
        type: 'problem',
        docs: {
            description: "Disallow 'isChecked' prop on Toggle component — it is silently ignored",
        },
        messages: {
            noIsChecked: "Toggle component does not support the 'isChecked' prop — it will be silently ignored. Use 'defaultChecked' for the initial state: <Toggle defaultChecked={value} onChange={handler} />",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                if (node.openingElement?.type !== 'JSXOpeningElement')
                    return;
                const elementName = node.openingElement.name;
                if (elementName?.type !== 'JSXIdentifier')
                    return;
                if (elementName.name !== 'Toggle')
                    return;
                const hasIsChecked = node.openingElement.attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'isChecked');
                if (hasIsChecked) {
                    context.report({
                        node,
                        messageId: 'noIsChecked',
                    });
                }
            },
        };
    },
});
