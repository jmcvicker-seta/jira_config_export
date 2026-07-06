"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'macro',
    createBase: () => ({
        type: 'macro',
        content: {
            id: 'sample',
            type: 'page',
            subtype: 'sample',
        },
        space: {
            id: 'sample',
            key: 'sample',
        },
        isEditing: false,
        references: [],
        config: {},
        macro: {
            body: {},
            isConfiguring: false,
            isInserting: false,
        },
        autoConvertLink: 'sample',
        template: {
            id: 'sample',
        },
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        macroInEditingMode: (base) => ({ ...base, isEditing: true, macro: { ...(base.macro || {}), isConfiguring: false, isInserting: false } }),
        macroConfigurationOnInsert: (base) => ({ ...base, isEditing: true, macro: { ...(base.macro || {}), isConfiguring: true, isInserting: true } }),
        macroWithAutoconvert: (base) => ({ ...base, autoConvertLink: "https://www.example.com/content/about", macro: { ...(base.macro || {}), isInserting: true } }),
        /** First-time macro insertion — content.id is empty because the page hasn't been saved yet. */
        macroFirstInsertion: (base) => ({ ...base, isEditing: true, content: { ...(base.content || {}), id: '' }, macro: { ...(base.macro || {}), isConfiguring: false, isInserting: true } }),
    }
};
