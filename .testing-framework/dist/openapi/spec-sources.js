"use strict";
/**
 * OpenAPI specification sources for Atlassian product APIs.
 *
 * These specs can be used for:
 * - Generating fixture templates with correct response shapes
 * - Validating that fixture files match real API schemas
 * - Auto-generating fixture file suggestions in error messages
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPEC_SOURCES = void 0;
exports.SPEC_SOURCES = [
    {
        name: 'Jira Platform (REST API v3)',
        product: 'jira',
        url: 'https://dac-static.atlassian.com/cloud/jira/platform/swagger-v3.v3.json',
        filename: 'jira-platform-v3.v3.json',
    },
    {
        name: 'Jira Service Management',
        product: 'jira',
        url: 'https://dac-static.atlassian.com/cloud/jira/service-desk/swagger.v3.json',
        filename: 'jira-service-desk.v3.json',
    },
    {
        name: 'Jira Software',
        product: 'jira',
        url: 'https://dac-static.atlassian.com/cloud/jira/software/swagger.v3.json',
        filename: 'jira-software.v3.json',
    },
    {
        name: 'Confluence (REST API v2)',
        product: 'confluence',
        url: 'https://dac-static.atlassian.com/cloud/confluence/openapi-v2.v3.json',
        filename: 'confluence.v3.json',
    },
    {
        // Kept alongside v2 because many v1 endpoints (search, group, audit, etc.) have no v2 equivalent.
        name: 'Confluence (REST API v1, legacy)',
        product: 'confluence',
        url: 'https://dac-static.atlassian.com/cloud/confluence/swagger.v3.json',
        filename: 'confluence-v1.v3.json',
    },
    {
        name: 'Bitbucket',
        product: 'bitbucket',
        url: 'https://dac-static.atlassian.com/cloud/bitbucket/swagger.v3.json',
        filename: 'bitbucket.v3.json',
    },
    {
        name: 'Admin - Organization',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/organization/swagger.v3.json',
        filename: 'admin-organization.v3.json',
    },
    {
        name: 'Admin - User Management',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/user-management/swagger.v3.json',
        filename: 'admin-user-management.v3.json',
    },
    {
        name: 'Admin - User Provisioning',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/user-provisioning/swagger.v3.json',
        filename: 'admin-user-provisioning.v3.json',
    },
    {
        name: 'Admin - DLP',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/dlp/swagger.v3.json',
        filename: 'admin-dlp.v3.json',
    },
    {
        name: 'Admin - Control',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/control/swagger.v3.json',
        filename: 'admin-control.v3.json',
    },
    {
        name: 'Admin - API Access',
        product: 'admin',
        url: 'https://dac-static.atlassian.com/cloud/admin/api-access/swagger.v3.json',
        filename: 'admin-api-access.v3.json',
    },
];
