"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:adminPage',
    createBase: () => ({
        type: 'jira:adminPage',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        configurePage: (base) => ({ ...base, useAsConfig: true }),
        getStartedPage: (base) => ({ ...base, useAsGetStarted: true }),
        adminPageWithSubpages: (base) => ({ ...base, pages: [{ "title": "page example", "route": "page-example-1" }] }),
    }
};
