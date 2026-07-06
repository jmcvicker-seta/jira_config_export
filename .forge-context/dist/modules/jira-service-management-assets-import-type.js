"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:assetsImportType',
    createBase: () => ({
        type: 'jiraServiceManagement:assetsImportType',
        importId: 'sample',
        workspaceId: 'sample',
        schemaId: 'sample',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        configureImportWithCredentials: (base) => ({ ...base, importId: "import-type-123", schemaId: "schema-456" }),
        startImportProcess: (base) => ({ ...base, importId: "import-type-789" }),
        checkImportStatus: (base) => ({ ...base, importId: "import-type-101" }),
    }
};
