"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:contextMenu',
    createBase: () => ({
        type: 'confluence:contextMenu',
        selectedText: 'sample',
        content: {
            id: 'sample',
            type: 'page',
            subtype: 'sample',
        },
        space: {
            id: 'sample',
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
};
