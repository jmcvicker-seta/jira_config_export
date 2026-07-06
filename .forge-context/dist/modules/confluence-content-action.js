"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:contentAction',
    createBase: () => ({
        type: 'confluence:contentAction',
        content: {
            id: 'sample',
            subtype: 'sample',
        },
        space: {
            id: 'sample',
            key: 'sample',
        },
        location: "https://example.atlassian.net/wiki/spaces/SPACE/pages/123456",
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        smallViewportModal: (base) => ({ ...base, viewportSize: "small" }),
        largeViewportModal: (base) => ({ ...base, viewportSize: "large" }),
        customUIWithResource: (base) => ({ ...base, resource: "custom-resource-key", render: null }),
    }
};
