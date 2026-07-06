import * as m0 from '../modules/action.js';
import * as m1 from '../modules/bitbucket-merge-check.js';
import * as m2 from '../modules/bitbucket-project-settings-menu-page.js';
import * as m3 from '../modules/bitbucket-repo-code-file-viewer.js';
import * as m4 from '../modules/bitbucket-repo-code-overview-action.js';
import * as m5 from '../modules/bitbucket-repo-code-overview-card.js';
import * as m6 from '../modules/bitbucket-repo-code-overview-panel.js';
import * as m7 from '../modules/bitbucket-repo-main-menu-page.js';
import * as m8 from '../modules/bitbucket-repo-pull-request-action.js';
import * as m9 from '../modules/bitbucket-repo-pull-request-card.js';
import * as m10 from '../modules/bitbucket-repo-pull-request-overview-panel.js';
import * as m11 from '../modules/bitbucket-repo-settings-menu-page.js';
import * as m12 from '../modules/bitbucket-workspace-global-page.js';
import * as m13 from '../modules/bitbucket-workspace-personal-settings-page.js';
import * as m14 from '../modules/bitbucket-workspace-settings-menu-page.js';
import * as m15 from '../modules/compass-component-page.js';
import * as m16 from '../modules/compass-team-page.js';
import * as m17 from '../modules/confluence-content-action.js';
import * as m18 from '../modules/confluence-content-byline-item.js';
import * as m19 from '../modules/confluence-context-menu.js';
import * as m20 from '../modules/confluence-custom-content.js';
import * as m21 from '../modules/confluence-global-page.js';
import * as m22 from '../modules/confluence-global-settings.js';
import * as m23 from '../modules/confluence-homepage-feed.js';
import * as m24 from '../modules/confluence-page-banner.js';
import * as m25 from '../modules/confluence-space-page.js';
import * as m26 from '../modules/confluence-space-settings.js';
import * as m27 from '../modules/dashboards-background-script.js';
import * as m28 from '../modules/dashboards-widget.js';
import * as m29 from '../modules/forge-trigger.js';
import * as m30 from '../modules/jira-admin-page.js';
import * as m31 from '../modules/jira-backlog-action.js';
import * as m32 from '../modules/jira-board-action.js';
import * as m33 from '../modules/jira-custom-field-type.js';
import * as m34 from '../modules/jira-custom-field.js';
import * as m35 from '../modules/jira-dashboard-background-script.js';
import * as m36 from '../modules/jira-dashboard-gadget.js';
import * as m37 from '../modules/jira-full-page.js';
import * as m38 from '../modules/jira-global-background-script.js';
import * as m39 from '../modules/jira-global-page.js';
import * as m40 from '../modules/jira-issue-action.js';
import * as m41 from '../modules/jira-issue-activity.js';
import * as m42 from '../modules/jira-issue-context.js';
import * as m43 from '../modules/jira-issue-glance.js';
import * as m44 from '../modules/jira-issue-navigator-action.js';
import * as m45 from '../modules/jira-issue-panel.js';
import * as m46 from '../modules/jira-issue-view-background-script.js';
import * as m47 from '../modules/jira-personal-settings-page.js';
import * as m48 from '../modules/jira-project-page.js';
import * as m49 from '../modules/jira-project-settings-page.js';
import * as m50 from '../modules/jira-service-management-assets-import-type.js';
import * as m51 from '../modules/jira-service-management-organization-panel.js';
import * as m52 from '../modules/jira-service-management-portal-footer.js';
import * as m53 from '../modules/jira-service-management-portal-header.js';
import * as m54 from '../modules/jira-service-management-portal-profile-panel.js';
import * as m55 from '../modules/jira-service-management-portal-request-create-property-panel.js';
import * as m56 from '../modules/jira-service-management-portal-request-detail-panel.js';
import * as m57 from '../modules/jira-service-management-portal-request-detail.js';
import * as m58 from '../modules/jira-service-management-portal-request-view-action.js';
import * as m59 from '../modules/jira-service-management-portal-subheader.js';
import * as m60 from '../modules/jira-service-management-portal-user-menu-action.js';
import * as m61 from '../modules/jira-service-management-queue-page.js';
import * as m62 from '../modules/jira-service-management-ui-modifications.js';
import * as m63 from '../modules/jira-sprint-action.js';
import * as m64 from '../modules/jira-ui-modifications.js';
import * as m65 from '../modules/jira-workflow-condition.js';
import * as m66 from '../modules/jira-workflow-post-function.js';
import * as m67 from '../modules/jira-workflow-validator.js';
import * as m68 from '../modules/macro.js';
import { DeepPartial } from '../utils.js';
import { ContextForKey } from '../types/module-definition.js';
import { ProductContext, ResolverContext, ExtensionData } from '../types/product-context.js';
declare const definitions: readonly [import("../types/module-definition.js").ModuleDefinition<"action", m0.ActionContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:mergeCheck", m1.MergeCheckContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:projectSettingsMenuPage", m2.ProjectSettingsMenuPageContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeFileViewer", m3.RepoCodeFileViewerContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewAction", m4.RepoCodeOverviewActionContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewCard", m5.RepoCodeOverviewCardContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewPanel", m6.RepoCodeOverviewPanelContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoMainMenuPage", m7.RepoMainMenuPageContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestAction", m8.RepoPullRequestActionContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestCard", m9.RepoPullRequestCardContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestOverviewPanel", m10.RepoPullRequestOverviewPanelContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoSettingsMenuPage", m11.RepoSettingsMenuPageContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspaceGlobalPage", m12.WorkspaceGlobalPageContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspacePersonalSettingsPage", m13.WorkspacePersonalSettingsPageContext>, import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspaceSettingsMenuPage", m14.WorkspaceSettingsMenuPageContext>, import("../types/module-definition.js").ModuleDefinition<"compass:componentPage", m15.ComponentPageContext>, import("../types/module-definition.js").ModuleDefinition<"compass:teamPage", m16.TeamPageContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:contentAction", m17.ContentActionContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:contentBylineItem", m18.ContentBylineItemContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:contextMenu", m19.ContextMenuContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:customContent", m20.CustomContentContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:globalPage", m21.ConfluenceGlobalPageContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:globalSettings", m22.GlobalSettingsContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:homepageFeed", m23.HomepageFeedContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:pageBanner", m24.PageBannerContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:spacePage", m25.SpacePageContext>, import("../types/module-definition.js").ModuleDefinition<"confluence:spaceSettings", m26.SpaceSettingsContext>, import("../types/module-definition.js").ModuleDefinition<"dashboards:backgroundScript", m27.BackgroundScriptContext>, import("../types/module-definition.js").ModuleDefinition<"dashboards:widget", m28.WidgetContext>, import("../types/module-definition.js").ModuleDefinition<"forge:trigger", m29.TriggerContext>, import("../types/module-definition.js").ModuleDefinition<"jira:adminPage", m30.AdminPageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:backlogAction", m31.BacklogActionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:boardAction", m32.BoardActionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:customFieldType", m33.CustomFieldTypeContext>, import("../types/module-definition.js").ModuleDefinition<"jira:customField", m34.CustomFieldContext>, import("../types/module-definition.js").ModuleDefinition<"jira:dashboardBackgroundScript", m35.DashboardBackgroundScriptContext>, import("../types/module-definition.js").ModuleDefinition<"jira:dashboardGadget", m36.DashboardGadgetContext>, import("../types/module-definition.js").ModuleDefinition<"jira:fullPage", m37.FullPageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:globalBackgroundScript", m38.GlobalBackgroundScriptContext>, import("../types/module-definition.js").ModuleDefinition<"jira:globalPage", m39.GlobalPageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueAction", m40.IssueActionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueActivity", m41.IssueActivityContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueContext", m42.IssueContextContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueGlance", m43.IssueGlanceContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueNavigatorAction", m44.IssueNavigatorActionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issuePanel", m45.IssuePanelContext>, import("../types/module-definition.js").ModuleDefinition<"jira:issueViewBackgroundScript", m46.IssueViewBackgroundScriptContext>, import("../types/module-definition.js").ModuleDefinition<"jira:personalSettingsPage", m47.PersonalSettingsPageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:projectPage", m48.ProjectPageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:projectSettingsPage", m49.ProjectSettingsPageContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:assetsImportType", m50.AssetsImportTypeContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:organizationPanel", m51.OrganizationPanelContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalFooter", m52.PortalFooterContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalHeader", m53.PortalHeaderContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalProfilePanel", m54.PortalProfilePanelContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestCreatePropertyPanel", m55.PortalRequestCreatePropertyPanelContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestDetailPanel", m56.PortalRequestDetailPanelContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestDetail", m57.PortalRequestDetailContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestViewAction", m58.PortalRequestViewActionContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalSubheader", m59.PortalSubheaderContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalUserMenuAction", m60.PortalUserMenuActionContext>, import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:queuePage", m61.QueuePageContext>, import("../types/module-definition.js").ModuleDefinition<"jira:uiModifications", m62.UiModificationsContext>, import("../types/module-definition.js").ModuleDefinition<"jira:sprintAction", m63.SprintActionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:uiModifications", m64.UiModificationsContext>, import("../types/module-definition.js").ModuleDefinition<"jira:workflowCondition", m65.WorkflowConditionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:workflowPostFunction", m66.WorkflowPostFunctionContext>, import("../types/module-definition.js").ModuleDefinition<"jira:workflowValidator", m67.WorkflowValidatorContext>, import("../types/module-definition.js").ModuleDefinition<"macro", m68.MacroContext>];
export type ForgeModuleKey = typeof definitions[number]['key'];
export type ModuleContext = ReturnType<typeof definitions[number]['createBase']>;
export type ContextForModule<K extends ForgeModuleKey> = ContextForKey<ModuleContext, K>;
/** Full frontend ProductContext with typed extension for a given module key. */
export type ProductContextForModule<K extends ForgeModuleKey> = ProductContext<ContextForModule<K> & ExtensionData>;
/** Full backend ResolverContext with typed extension for a given module key. */
export type ResolverContextForModule<K extends ForgeModuleKey> = ResolverContext<ContextForModule<K> & ExtensionData>;
declare const registry: {
    action: import("../types/module-definition.js").ModuleDefinition<"action", m0.ActionContext>;
    "bitbucket:mergeCheck": import("../types/module-definition.js").ModuleDefinition<"bitbucket:mergeCheck", m1.MergeCheckContext>;
    "bitbucket:projectSettingsMenuPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:projectSettingsMenuPage", m2.ProjectSettingsMenuPageContext>;
    "bitbucket:repoCodeFileViewer": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeFileViewer", m3.RepoCodeFileViewerContext>;
    "bitbucket:repoCodeOverviewAction": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewAction", m4.RepoCodeOverviewActionContext>;
    "bitbucket:repoCodeOverviewCard": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewCard", m5.RepoCodeOverviewCardContext>;
    "bitbucket:repoCodeOverviewPanel": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoCodeOverviewPanel", m6.RepoCodeOverviewPanelContext>;
    "bitbucket:repoMainMenuPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoMainMenuPage", m7.RepoMainMenuPageContext>;
    "bitbucket:repoPullRequestAction": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestAction", m8.RepoPullRequestActionContext>;
    "bitbucket:repoPullRequestCard": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestCard", m9.RepoPullRequestCardContext>;
    "bitbucket:repoPullRequestOverviewPanel": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoPullRequestOverviewPanel", m10.RepoPullRequestOverviewPanelContext>;
    "bitbucket:repoSettingsMenuPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:repoSettingsMenuPage", m11.RepoSettingsMenuPageContext>;
    "bitbucket:workspaceGlobalPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspaceGlobalPage", m12.WorkspaceGlobalPageContext>;
    "bitbucket:workspacePersonalSettingsPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspacePersonalSettingsPage", m13.WorkspacePersonalSettingsPageContext>;
    "bitbucket:workspaceSettingsMenuPage": import("../types/module-definition.js").ModuleDefinition<"bitbucket:workspaceSettingsMenuPage", m14.WorkspaceSettingsMenuPageContext>;
    "compass:componentPage": import("../types/module-definition.js").ModuleDefinition<"compass:componentPage", m15.ComponentPageContext>;
    "compass:teamPage": import("../types/module-definition.js").ModuleDefinition<"compass:teamPage", m16.TeamPageContext>;
    "confluence:contentAction": import("../types/module-definition.js").ModuleDefinition<"confluence:contentAction", m17.ContentActionContext>;
    "confluence:contentBylineItem": import("../types/module-definition.js").ModuleDefinition<"confluence:contentBylineItem", m18.ContentBylineItemContext>;
    "confluence:contextMenu": import("../types/module-definition.js").ModuleDefinition<"confluence:contextMenu", m19.ContextMenuContext>;
    "confluence:customContent": import("../types/module-definition.js").ModuleDefinition<"confluence:customContent", m20.CustomContentContext>;
    "confluence:globalPage": import("../types/module-definition.js").ModuleDefinition<"confluence:globalPage", m21.ConfluenceGlobalPageContext>;
    "confluence:globalSettings": import("../types/module-definition.js").ModuleDefinition<"confluence:globalSettings", m22.GlobalSettingsContext>;
    "confluence:homepageFeed": import("../types/module-definition.js").ModuleDefinition<"confluence:homepageFeed", m23.HomepageFeedContext>;
    "confluence:pageBanner": import("../types/module-definition.js").ModuleDefinition<"confluence:pageBanner", m24.PageBannerContext>;
    "confluence:spacePage": import("../types/module-definition.js").ModuleDefinition<"confluence:spacePage", m25.SpacePageContext>;
    "confluence:spaceSettings": import("../types/module-definition.js").ModuleDefinition<"confluence:spaceSettings", m26.SpaceSettingsContext>;
    "dashboards:backgroundScript": import("../types/module-definition.js").ModuleDefinition<"dashboards:backgroundScript", m27.BackgroundScriptContext>;
    "dashboards:widget": import("../types/module-definition.js").ModuleDefinition<"dashboards:widget", m28.WidgetContext>;
    "forge:trigger": import("../types/module-definition.js").ModuleDefinition<"forge:trigger", m29.TriggerContext>;
    "jira:adminPage": import("../types/module-definition.js").ModuleDefinition<"jira:adminPage", m30.AdminPageContext>;
    "jira:backlogAction": import("../types/module-definition.js").ModuleDefinition<"jira:backlogAction", m31.BacklogActionContext>;
    "jira:boardAction": import("../types/module-definition.js").ModuleDefinition<"jira:boardAction", m32.BoardActionContext>;
    "jira:customFieldType": import("../types/module-definition.js").ModuleDefinition<"jira:customFieldType", m33.CustomFieldTypeContext>;
    "jira:customField": import("../types/module-definition.js").ModuleDefinition<"jira:customField", m34.CustomFieldContext>;
    "jira:dashboardBackgroundScript": import("../types/module-definition.js").ModuleDefinition<"jira:dashboardBackgroundScript", m35.DashboardBackgroundScriptContext>;
    "jira:dashboardGadget": import("../types/module-definition.js").ModuleDefinition<"jira:dashboardGadget", m36.DashboardGadgetContext>;
    "jira:fullPage": import("../types/module-definition.js").ModuleDefinition<"jira:fullPage", m37.FullPageContext>;
    "jira:globalBackgroundScript": import("../types/module-definition.js").ModuleDefinition<"jira:globalBackgroundScript", m38.GlobalBackgroundScriptContext>;
    "jira:globalPage": import("../types/module-definition.js").ModuleDefinition<"jira:globalPage", m39.GlobalPageContext>;
    "jira:issueAction": import("../types/module-definition.js").ModuleDefinition<"jira:issueAction", m40.IssueActionContext>;
    "jira:issueActivity": import("../types/module-definition.js").ModuleDefinition<"jira:issueActivity", m41.IssueActivityContext>;
    "jira:issueContext": import("../types/module-definition.js").ModuleDefinition<"jira:issueContext", m42.IssueContextContext>;
    "jira:issueGlance": import("../types/module-definition.js").ModuleDefinition<"jira:issueGlance", m43.IssueGlanceContext>;
    "jira:issueNavigatorAction": import("../types/module-definition.js").ModuleDefinition<"jira:issueNavigatorAction", m44.IssueNavigatorActionContext>;
    "jira:issuePanel": import("../types/module-definition.js").ModuleDefinition<"jira:issuePanel", m45.IssuePanelContext>;
    "jira:issueViewBackgroundScript": import("../types/module-definition.js").ModuleDefinition<"jira:issueViewBackgroundScript", m46.IssueViewBackgroundScriptContext>;
    "jira:personalSettingsPage": import("../types/module-definition.js").ModuleDefinition<"jira:personalSettingsPage", m47.PersonalSettingsPageContext>;
    "jira:projectPage": import("../types/module-definition.js").ModuleDefinition<"jira:projectPage", m48.ProjectPageContext>;
    "jira:projectSettingsPage": import("../types/module-definition.js").ModuleDefinition<"jira:projectSettingsPage", m49.ProjectSettingsPageContext>;
    "jiraServiceManagement:assetsImportType": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:assetsImportType", m50.AssetsImportTypeContext>;
    "jiraServiceManagement:organizationPanel": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:organizationPanel", m51.OrganizationPanelContext>;
    "jiraServiceManagement:portalFooter": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalFooter", m52.PortalFooterContext>;
    "jiraServiceManagement:portalHeader": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalHeader", m53.PortalHeaderContext>;
    "jiraServiceManagement:portalProfilePanel": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalProfilePanel", m54.PortalProfilePanelContext>;
    "jiraServiceManagement:portalRequestCreatePropertyPanel": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestCreatePropertyPanel", m55.PortalRequestCreatePropertyPanelContext>;
    "jiraServiceManagement:portalRequestDetailPanel": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestDetailPanel", m56.PortalRequestDetailPanelContext>;
    "jiraServiceManagement:portalRequestDetail": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestDetail", m57.PortalRequestDetailContext>;
    "jiraServiceManagement:portalRequestViewAction": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalRequestViewAction", m58.PortalRequestViewActionContext>;
    "jiraServiceManagement:portalSubheader": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalSubheader", m59.PortalSubheaderContext>;
    "jiraServiceManagement:portalUserMenuAction": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:portalUserMenuAction", m60.PortalUserMenuActionContext>;
    "jiraServiceManagement:queuePage": import("../types/module-definition.js").ModuleDefinition<"jiraServiceManagement:queuePage", m61.QueuePageContext>;
    "jira:uiModifications": import("../types/module-definition.js").ModuleDefinition<"jira:uiModifications", m62.UiModificationsContext> | import("../types/module-definition.js").ModuleDefinition<"jira:uiModifications", m64.UiModificationsContext>;
    "jira:sprintAction": import("../types/module-definition.js").ModuleDefinition<"jira:sprintAction", m63.SprintActionContext>;
    "jira:workflowCondition": import("../types/module-definition.js").ModuleDefinition<"jira:workflowCondition", m65.WorkflowConditionContext>;
    "jira:workflowPostFunction": import("../types/module-definition.js").ModuleDefinition<"jira:workflowPostFunction", m66.WorkflowPostFunctionContext>;
    "jira:workflowValidator": import("../types/module-definition.js").ModuleDefinition<"jira:workflowValidator", m67.WorkflowValidatorContext>;
    macro: import("../types/module-definition.js").ModuleDefinition<"macro", m68.MacroContext>;
};
/**
 * Creates a full mock frontend ProductContext for the specified Forge module.
 *
 * Returns the same shape as useProductContext() / view.getContext() — an envelope
 * with accountId, cloudId, moduleKey, siteUrl, locale, timezone, theme, etc.,
 * wrapping a typed \`extension\` object with module-specific data.
 *
 * Use this when testing **frontend** code (UI Kit or Custom UI).
 * For **backend** testing (resolvers, function handlers), use \`createMockResolverContext()\` instead.
 *
 * @param key - The Forge module key (e.g., 'jira:issuePanel')
 * @param overrides - Optional deep-partial to override any envelope or extension fields
 * @returns A complete ProductContext with typed extension data
 */
export declare function createMockContext<K extends ForgeModuleKey>(key: K, overrides?: DeepPartial<ProductContextForModule<K>>): ProductContextForModule<K>;
/**
 * Creates a mock frontend ProductContext using a predefined scenario for the given module.
 *
 * @param key - The Forge module key
 * @param scenario - The scenario name (use listScenarios() to discover available ones)
 * @param overrides - Optional deep-partial to override fields on top of the scenario
 */
export declare function createScenarioContext<K extends ForgeModuleKey>(key: K, scenario: string, overrides?: DeepPartial<ProductContextForModule<K>>): ProductContextForModule<K>;
/**
 * Creates a mock backend ResolverContext for the specified Forge module.
 *
 * Returns the same shape as \`req.context\` in a Forge resolver or function handler —
 * an envelope with accountId, cloudId, moduleKey, siteUrl, accountType, installContext,
 * installation, etc., wrapping a typed \`extension\` object with module-specific data.
 *
 * Use this when testing **backend** code (resolvers, function handlers).
 * For **frontend** testing (useProductContext / view.getContext), use \`createMockContext()\` instead.
 *
 * @param key - The Forge module key (e.g., 'jira:issuePanel')
 * @param overrides - Optional deep-partial to override any envelope or extension fields
 * @returns A complete ResolverContext with typed extension data
 */
export declare function createMockResolverContext<K extends ForgeModuleKey>(key: K, overrides?: DeepPartial<ResolverContextForModule<K>>): ResolverContextForModule<K>;
export declare function getSupportedModules(): ForgeModuleKey[];
export declare function isModuleSupported(k: string): k is ForgeModuleKey;
export declare function listScenarios<K extends ForgeModuleKey>(key: K): string[];
export { registry };
