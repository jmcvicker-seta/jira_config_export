"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:contentBylineItem',
    createBase: () => ({
        type: 'confluence:contentBylineItem',
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayBylineItemOnPage: (base) => ({ ...base, content: { ...(base.content || {}), type: "page", id: "12345" } }),
        displayBylineItemOnBlogPost: (base) => ({ ...base, content: { ...(base.content || {}), type: "blogpost", id: "67890" } }),
    }
};
