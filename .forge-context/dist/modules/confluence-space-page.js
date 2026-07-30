"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'confluence:spacePage',
    createBase: () => ({
        type: 'confluence:spacePage',
        space: {
            id: 'sample',
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        customSpaceDashboard: (base) => ({ ...base, title: "Team Dashboard", route: "team-dashboard", icon: "dashboard-icon.png" }),
        spaceReports: (base) => ({ ...base, title: "Space Reports", route: "reports", keyboardShortcut: { ...(base.keyboardShortcut || {}), key: "r" } }),
        customToolsPage: (base) => ({ ...base, title: "Space Tools", route: "tools", unlicensedAccess: ["unlicensed"] }),
    }
};
