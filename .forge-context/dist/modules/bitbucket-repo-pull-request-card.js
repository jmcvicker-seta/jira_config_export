"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoPullRequestCard',
    createBase: () => ({
        type: 'bitbucket:repoPullRequestCard',
        repository: {
            uuid: 'sample',
        },
        pullRequest: {
            id: 1,
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayPullRequestCardWithUIKit: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "myResolverFunction" } }),
        displayPullRequestCardWithCustomUI: (base) => ({ ...base, resource: "myCustomResource", resolver: { ...(base.resolver || {}), endpoint: "https://example.com/resolver" } }),
    }
};
