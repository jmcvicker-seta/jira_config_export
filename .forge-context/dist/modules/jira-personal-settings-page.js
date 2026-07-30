"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:personalSettingsPage',
    createBase: () => ({
        type: 'jira:personalSettingsPage',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        basicPersonalSettingsPage: (base) => ({ ...base, render: "native", viewportSize: "medium", layout: "native" }),
        personalSettingsWithSubpages: (base) => ({ ...base, pages: [{ "title": "General", "route": "general" }, { "title": "Notifications", "route": "notifications" }] }),
        personalSettingsWithSections: (base) => ({ ...base, sections: [{ "header": "Account", "pages": [{ "title": "Profile", "route": "profile" }] }] }),
    }
};
