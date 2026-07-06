"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'compass:teamPage',
    createBase: () => ({
        type: 'compass:teamPage',
        teamId: "ari:cloud:compass::team/12345",
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        teamPageWithUIKitResolver: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "resolveTeamPage" } }),
        teamPageWithStaticResource: (base) => ({ ...base, resource: "team-page-resource" }),
        teamPageWithRemoteEndpoint: (base) => ({ ...base, resolver: { ...(base.resolver || {}), endpoint: "https://example.com/team-page" } }),
    }
};
