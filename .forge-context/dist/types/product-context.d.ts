/**
 * Context types for Forge apps — frontend and backend.
 *
 * Forge provides two different context shapes depending on where code runs:
 *
 * - **Frontend** (UI Kit / Custom UI): `useProductContext()` / `view.getContext()` returns
 *   a `ProductContext` with user-facing fields like locale, timezone, theme.
 *
 * - **Backend** (Resolvers / Function handlers): `req.context` provides a `ResolverContext`
 *   with platform fields like accountType, installContext, installation.
 *
 * Both share the same `extension` object with module-specific data, and several common
 * envelope fields (accountId, cloudId, moduleKey, siteUrl, etc.).
 *
 * Validated against real Forge runtime output (Feb 2026).
 */
/**
 * Module-specific extension data. Each module type defines its own shape.
 */
export interface ExtensionData {
    type: string;
    [k: string]: unknown;
}
/**
 * License details for paid apps (null/undefined in development or for free apps).
 */
export interface LicenseDetails {
    active: boolean;
    billingPeriod: string;
    ccpEntitlementId: string;
    ccpEntitlementSlug: string;
    isEvaluation: boolean;
    subscriptionEndDate: string | null;
    supportEntitlementNumber: string | null;
    trialEndDate: string | null;
    type: string;
}
/**
 * Theme context describing the user's current color mode and design tokens.
 */
export interface ThemeContext {
    colorMode: 'light' | 'dark';
    dark: string;
    light: string;
    spacing: string;
    typography: string;
    [key: string]: string;
}
/**
 * User access information.
 */
export interface UserAccess {
    enabled: boolean;
    hasAccess: boolean;
}
/**
 * App permissions granted via the manifest.
 */
export interface AppPermissions {
    scopes: string[];
    external: {
        fetch: {
            backend: string[];
            client: string[];
        };
        fonts: string[];
        styles: string[];
        frames: string[];
        images: string[];
        media: string[];
        scripts: string[];
    };
}
/**
 * The full context object returned by useProductContext() in UI Kit
 * or view.getContext() in Custom UI.
 *
 * Generic parameter E represents the module-specific extension data shape.
 */
export interface ProductContext<E extends ExtensionData = ExtensionData> {
    /** The Atlassian account ID of the current user. */
    accountId?: string;
    /** The cloud instance ID (Jira or Confluence site). */
    cloudId?: string;
    /** Workspace ID (Bitbucket-specific). */
    workspaceId?: string;
    /** Module-specific extension data. */
    extension: E;
    /** License details (null for free/dev apps). */
    license?: LicenseDetails | null;
    /** Unique ID for this instance of the module in the content. */
    localId: string;
    /** The user's locale (e.g., "en-US"). */
    locale: string;
    /** The module key as defined in manifest.yml. */
    moduleKey: string;
    /** The URL of the site (e.g., "https://example.atlassian.net"). */
    siteUrl: string;
    /** The user's timezone (e.g., "Australia/Melbourne"). */
    timezone: string;
    /** Theme information for the current user. */
    theme?: ThemeContext;
    /** The app's deployed version. Present for both Jira and Confluence. */
    appVersion?: string;
    /** The environment ID (UUID). */
    environmentId?: string;
    /** The environment type (e.g., "DEVELOPMENT", "PRODUCTION", "STAGING"). */
    environmentType?: string;
    /** The surface background color (e.g., "#FFFFFF"). */
    surfaceColor?: string;
    /** User access control information. */
    userAccess?: UserAccess;
    /** App permissions (scopes and external resource access). */
    permissions?: AppPermissions;
}
/**
 * Installation context for an app on a specific site.
 */
export interface Installation {
    ari: {
        installationId: string;
    };
    contexts: Array<{
        cloudId: string;
        workspaceId: string;
    }>;
}
/**
 * The context available in backend resolvers and function handlers via `req.context`.
 *
 * Use `createMockResolverContext()` to generate mock instances for testing backend code.
 *
 * Compared to the frontend `ProductContext`, the resolver context:
 * - **Adds**: accountType, installContext, installation, jobId
 * - **Omits**: locale, timezone, theme, surfaceColor, permissions, workspaceId
 */
export interface ResolverContext<E extends ExtensionData = ExtensionData> {
    /** The Atlassian account ID of the current user. */
    accountId: string;
    /** The cloud instance ID. */
    cloudId: string;
    /** Unique ID for this instance of the module in the content. */
    localId: string;
    /** The module key as defined in manifest.yml. */
    moduleKey: string;
    /** The environment ID (UUID). */
    environmentId: string;
    /** The environment type (e.g., "DEVELOPMENT", "PRODUCTION", "STAGING"). */
    environmentType: string;
    /** The URL of the site (e.g., "https://example.atlassian.net"). */
    siteUrl: string;
    /** The app's deployed version. */
    appVersion?: string;
    /** Module-specific extension data. */
    extension: E;
    /** User access control information. */
    userAccess: UserAccess;
    /** The account type (e.g., "licensed"). */
    accountType: string;
    /** The install context ARI (e.g., "ari:cloud:jira::site/{cloudId}"). */
    installContext: string;
    /** License details (null for free/dev apps). */
    license?: LicenseDetails | null;
    /** Job ID (typically null for interactive requests). */
    jobId?: string | null;
    /** Installation details including the installation ARI and site contexts. */
    installation: Installation;
}
/**
 * Creates a default frontend ProductContext envelope with generic placeholder values.
 * Not tied to any real site or user.
 */
export declare function createDefaultEnvelope<E extends ExtensionData>(moduleKey: string, extension: E): ProductContext<E>;
/**
 * Creates a default backend ResolverContext envelope with generic placeholder values.
 * Not tied to any real site or user.
 */
export declare function createDefaultResolverEnvelope<E extends ExtensionData>(moduleKey: string, extension: E): ResolverContext<E>;
