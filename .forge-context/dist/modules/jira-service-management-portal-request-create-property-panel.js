"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jiraServiceManagement:portalRequestCreatePropertyPanel',
    createBase: () => ({
        type: 'jiraServiceManagement:portalRequestCreatePropertyPanel',
        portal: {
            id: 1,
        },
        request: {
            typeId: 1,
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        createRequestWithCustomProperty: (base) => ({ ...base, fields: [{ "path": "fields", "type": "object[]", "required": true, "description": "List of field objects with key and value properties" }, { "path": "isValid", "type": "boolean", "required": true, "description": "Indicates if all fields in the form are valid" }] }),
        retrievePropertyInRequestDetail: (base) => ({ ...base, fields: [{ "path": "extension.request.property", "type": "object", "required": false, "description": "Property data saved during request creation" }] }),
    }
};
