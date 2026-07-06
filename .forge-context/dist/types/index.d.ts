/**
 * TypeScript type definitions for Forge module contexts
 *
 * This file provides a comprehensive set of TypeScript types for all Forge module contexts.
 * Types are organized into:
 * - Common/shared types used across modules
 * - Individual module context types (re-exported from modules/)
 * - ProductContext (the full useProductContext() return type)
 * - Utility types and helpers
 */
export type { ModuleDefinition, BaseIssue, BaseProject, ProjectType } from './module-definition.js';
export type { ProductContext, ResolverContext, ExtensionData, LicenseDetails, ThemeContext, UserAccess, AppPermissions, Installation, } from './product-context.js';
export { createDefaultEnvelope, createDefaultResolverEnvelope } from './product-context.js';
export * from './modules/index.js';
export type RenderContext = 'issue-view' | 'issue-create' | 'issue-transition' | 'portal-request';
export type Experience = 'issue-view' | 'issue-create' | 'issue-transition' | 'portal-request';
export type EntryPoint = 'edit' | 'view' | 'contextConfig';
export interface JiraIssueChangedEvent {
    issueId: string;
    projectId: string;
    changes: Array<{
        changeType: 'updated' | 'commented';
        atlassianId: string;
    }>;
}
