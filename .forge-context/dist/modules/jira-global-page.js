"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:globalPage',
    createBase: () => ({
        type: 'jira:globalPage',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        basicGlobalPage: (base) => ({ ...base, key: "hello-world-global-page", resource: "main", render: "native", title: "Hello World!" }),
        globalPageWithSubpages: (base) => ({ ...base, key: "hello-world-jira-module-page-example", resource: "main", render: "native", title: "Hello World", pages: [{ "title": "page example", "route": "page-example-1", "icon": "https://example.com/icon.png" }] }),
        globalPageWithSections: (base) => ({ ...base, key: "hello-world-jira-module-section-example", resource: "main", render: "native", title: "Hello World", sections: [{ "header": "example section", "pages": [{ "title": "page example", "route": "page-example-1", "icon": "https://example.com/icon.png" }] }] }),
    }
};
