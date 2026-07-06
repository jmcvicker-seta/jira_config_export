"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:spaceSettings',
    createBase: () => ({
        type: 'confluence:spaceSettings',
        space: {
            id: 'sample',
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
};
