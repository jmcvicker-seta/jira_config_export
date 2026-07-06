"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:customContent',
    createBase: () => ({
        type: 'confluence:customContent',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayCustomContentOnPage: (base) => ({ ...base, supportedContainerTypes: ["page"], bodyType: "storage" }),
        customContentWithAttachmentsAndComments: (base) => ({ ...base, supportedChildTypes: ["attachment", "comment"] }),
        searchableCustomContent: (base) => ({ ...base, indexing: true }),
    }
};
