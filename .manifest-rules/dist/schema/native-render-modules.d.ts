/**
 * UI Kit modules - modules that support UI Kit (resource + render: native).
 *
 * For these modules, we enforce:
 * - Must have 'resource' property pointing to frontend code
 * - Must have 'render: native' for UI Kit
 * - Must NOT have top-level 'function' (use resolver.function instead)
 *
 * Extracted from @forge/manifest schema with exclusions for modules
 * where UI Kit is not actually supported (see extract-native-modules.ts).
 *
 * To regenerate: npx tsx scripts/extract-native-modules.ts
 * Last updated: 2026-01-20
 */
export declare const UI_KIT_MODULES: readonly ["macro", "dashboards:widget", "dashboards:backgroundScript", "confluence:contextMenu", "confluence:contentAction", "confluence:contentBylineItem", "confluence:homepageFeed", "confluence:spacePage", "confluence:spaceSettings", "confluence:globalSettings", "confluence:globalPage", "confluence:fullPage", "confluence:customContent", "confluence:backgroundScript", "confluence:pageBanner", "jira:issueAction", "jira:issueGlance", "jira:issuePanel", "jira:issueActivity", "jira:dashboardGadget", "jira:adminPage", "jira:projectPage", "jira:fullPage", "jira:globalPage", "jira:projectSettingsPage", "jira:dashboardBackgroundScript", "jira:issueContext", "jira:issueViewBackgroundScript", "jira:issueNavigatorAction", "jira:personalSettingsPage", "jira:backlogAction", "jira:boardAction", "jira:sprintAction", "jira:globalBackgroundScript", "jiraServiceManagement:queuePage", "jiraServiceManagement:portalRequestDetail", "jiraServiceManagement:portalRequestDetailPanel", "jiraServiceManagement:organizationPanel", "jiraServiceManagement:portalFooter", "jiraServiceManagement:portalHeader", "jiraServiceManagement:portalSubheader", "jiraServiceManagement:portalProfilePanel", "jiraServiceManagement:portalUserMenuAction", "jiraServiceManagement:portalRequestViewAction", "jiraServiceManagement:portalRequestCreatePropertyPanel", "jiraServiceManagement:assetsImportType"];
export type UiKitModule = (typeof UI_KIT_MODULES)[number];
/**
 * Check if a module type is a UI Kit module that requires resource + render: native.
 */
export declare function isUiKitModule(moduleType: string): boolean;
/**
 * Modules excluded from UI_KIT_MODULES because UI Kit is not supported:
 * - action
 * - jira:workflowValidator
 * - jira:customField
 * - jira:customFieldType
 * - jira:uiModifications
 * - jira:workflowCondition
 * - jira:workflowPostFunction
 * - jira:command
 * See extract-native-modules.ts for exclusion reasons.
 */
//# sourceMappingURL=native-render-modules.d.ts.map