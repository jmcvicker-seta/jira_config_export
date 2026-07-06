"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:homepageFeed',
    createBase: () => ({
        type: 'confluence:homepageFeed',
        location: "https://confluence.example.com/wiki/spaces/home",
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        customUIWithSmallViewport: (base) => ({ ...base, resource: "my-feed-resource", viewportSize: "small", render: null }),
        uIKitWithFunctionResolver: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "resolveFeedContent" } }),
        remoteEndpointIntegration: (base) => ({ ...base, resolver: { ...(base.resolver || {}), endpoint: "https://remote-backend.example.com/feed" } }),
    }
};
