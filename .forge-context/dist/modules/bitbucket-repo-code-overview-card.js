"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoCodeOverviewCard',
    createBase: () => ({
        type: 'bitbucket:repoCodeOverviewCard',
        repository: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayRepositoryOverviewCardWithUIKit: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "resolveCard" } }),
        displayRepositoryOverviewCardWithCustomUI: (base) => ({ ...base, resource: "card-resource", resolver: { ...(base.resolver || {}), endpoint: "https://example.com/resolve" } }),
    }
};
