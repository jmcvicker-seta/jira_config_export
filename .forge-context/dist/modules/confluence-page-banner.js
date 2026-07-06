"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:pageBanner',
    createBase: () => ({
        type: 'confluence:pageBanner',
        content: {
            id: 'sample',
            type: 'sample',
            subtype: 'sample'
        },
        space: {
            id: 'sample',
            key: 'sample'
        },
        location: 'https://example.atlassian.net',
    }),
};
