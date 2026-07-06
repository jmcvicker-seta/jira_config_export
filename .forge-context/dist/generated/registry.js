"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
exports.createMockContext = createMockContext;
exports.createScenarioContext = createScenarioContext;
exports.createMockResolverContext = createMockResolverContext;
exports.getSupportedModules = getSupportedModules;
exports.isModuleSupported = isModuleSupported;
exports.listScenarios = listScenarios;
/* AUTO-GENERATED FILE. DO NOT EDIT. */
const m0 = __importStar(require("../modules/action.js"));
const m1 = __importStar(require("../modules/bitbucket-merge-check.js"));
const m2 = __importStar(require("../modules/bitbucket-project-settings-menu-page.js"));
const m3 = __importStar(require("../modules/bitbucket-repo-code-file-viewer.js"));
const m4 = __importStar(require("../modules/bitbucket-repo-code-overview-action.js"));
const m5 = __importStar(require("../modules/bitbucket-repo-code-overview-card.js"));
const m6 = __importStar(require("../modules/bitbucket-repo-code-overview-panel.js"));
const m7 = __importStar(require("../modules/bitbucket-repo-main-menu-page.js"));
const m8 = __importStar(require("../modules/bitbucket-repo-pull-request-action.js"));
const m9 = __importStar(require("../modules/bitbucket-repo-pull-request-card.js"));
const m10 = __importStar(require("../modules/bitbucket-repo-pull-request-overview-panel.js"));
const m11 = __importStar(require("../modules/bitbucket-repo-settings-menu-page.js"));
const m12 = __importStar(require("../modules/bitbucket-workspace-global-page.js"));
const m13 = __importStar(require("../modules/bitbucket-workspace-personal-settings-page.js"));
const m14 = __importStar(require("../modules/bitbucket-workspace-settings-menu-page.js"));
const m15 = __importStar(require("../modules/compass-component-page.js"));
const m16 = __importStar(require("../modules/compass-team-page.js"));
const m17 = __importStar(require("../modules/confluence-content-action.js"));
const m18 = __importStar(require("../modules/confluence-content-byline-item.js"));
const m19 = __importStar(require("../modules/confluence-context-menu.js"));
const m20 = __importStar(require("../modules/confluence-custom-content.js"));
const m21 = __importStar(require("../modules/confluence-global-page.js"));
const m22 = __importStar(require("../modules/confluence-global-settings.js"));
const m23 = __importStar(require("../modules/confluence-homepage-feed.js"));
const m24 = __importStar(require("../modules/confluence-page-banner.js"));
const m25 = __importStar(require("../modules/confluence-space-page.js"));
const m26 = __importStar(require("../modules/confluence-space-settings.js"));
const m27 = __importStar(require("../modules/dashboards-background-script.js"));
const m28 = __importStar(require("../modules/dashboards-widget.js"));
const m29 = __importStar(require("../modules/forge-trigger.js"));
const m30 = __importStar(require("../modules/jira-admin-page.js"));
const m31 = __importStar(require("../modules/jira-backlog-action.js"));
const m32 = __importStar(require("../modules/jira-board-action.js"));
const m33 = __importStar(require("../modules/jira-custom-field-type.js"));
const m34 = __importStar(require("../modules/jira-custom-field.js"));
const m35 = __importStar(require("../modules/jira-dashboard-background-script.js"));
const m36 = __importStar(require("../modules/jira-dashboard-gadget.js"));
const m37 = __importStar(require("../modules/jira-full-page.js"));
const m38 = __importStar(require("../modules/jira-global-background-script.js"));
const m39 = __importStar(require("../modules/jira-global-page.js"));
const m40 = __importStar(require("../modules/jira-issue-action.js"));
const m41 = __importStar(require("../modules/jira-issue-activity.js"));
const m42 = __importStar(require("../modules/jira-issue-context.js"));
const m43 = __importStar(require("../modules/jira-issue-glance.js"));
const m44 = __importStar(require("../modules/jira-issue-navigator-action.js"));
const m45 = __importStar(require("../modules/jira-issue-panel.js"));
const m46 = __importStar(require("../modules/jira-issue-view-background-script.js"));
const m47 = __importStar(require("../modules/jira-personal-settings-page.js"));
const m48 = __importStar(require("../modules/jira-project-page.js"));
const m49 = __importStar(require("../modules/jira-project-settings-page.js"));
const m50 = __importStar(require("../modules/jira-service-management-assets-import-type.js"));
const m51 = __importStar(require("../modules/jira-service-management-organization-panel.js"));
const m52 = __importStar(require("../modules/jira-service-management-portal-footer.js"));
const m53 = __importStar(require("../modules/jira-service-management-portal-header.js"));
const m54 = __importStar(require("../modules/jira-service-management-portal-profile-panel.js"));
const m55 = __importStar(require("../modules/jira-service-management-portal-request-create-property-panel.js"));
const m56 = __importStar(require("../modules/jira-service-management-portal-request-detail-panel.js"));
const m57 = __importStar(require("../modules/jira-service-management-portal-request-detail.js"));
const m58 = __importStar(require("../modules/jira-service-management-portal-request-view-action.js"));
const m59 = __importStar(require("../modules/jira-service-management-portal-subheader.js"));
const m60 = __importStar(require("../modules/jira-service-management-portal-user-menu-action.js"));
const m61 = __importStar(require("../modules/jira-service-management-queue-page.js"));
const m62 = __importStar(require("../modules/jira-service-management-ui-modifications.js"));
const m63 = __importStar(require("../modules/jira-sprint-action.js"));
const m64 = __importStar(require("../modules/jira-ui-modifications.js"));
const m65 = __importStar(require("../modules/jira-workflow-condition.js"));
const m66 = __importStar(require("../modules/jira-workflow-post-function.js"));
const m67 = __importStar(require("../modules/jira-workflow-validator.js"));
const m68 = __importStar(require("../modules/macro.js"));
const utils_js_1 = require("../utils.js");
const product_context_js_1 = require("../types/product-context.js");
const definitions = [m0.definition, m1.definition, m2.definition, m3.definition, m4.definition, m5.definition, m6.definition, m7.definition, m8.definition, m9.definition, m10.definition, m11.definition, m12.definition, m13.definition, m14.definition, m15.definition, m16.definition, m17.definition, m18.definition, m19.definition, m20.definition, m21.definition, m22.definition, m23.definition, m24.definition, m25.definition, m26.definition, m27.definition, m28.definition, m29.definition, m30.definition, m31.definition, m32.definition, m33.definition, m34.definition, m35.definition, m36.definition, m37.definition, m38.definition, m39.definition, m40.definition, m41.definition, m42.definition, m43.definition, m44.definition, m45.definition, m46.definition, m47.definition, m48.definition, m49.definition, m50.definition, m51.definition, m52.definition, m53.definition, m54.definition, m55.definition, m56.definition, m57.definition, m58.definition, m59.definition, m60.definition, m61.definition, m62.definition, m63.definition, m64.definition, m65.definition, m66.definition, m67.definition, m68.definition];
const registry = definitions.reduce((acc, def) => {
    acc[def.key] = def;
    return acc;
}, {});
exports.registry = registry;
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
function createMockContext(key, overrides) {
    const def = registry[key];
    if (!def)
        throw new Error('Unknown module: ' + key);
    const extensionBase = def.createBase();
    const base = (0, product_context_js_1.createDefaultEnvelope)(key, extensionBase);
    return overrides ? (0, utils_js_1.deepMerge)(base, overrides) : base;
}
/**
 * Creates a mock frontend ProductContext using a predefined scenario for the given module.
 *
 * @param key - The Forge module key
 * @param scenario - The scenario name (use listScenarios() to discover available ones)
 * @param overrides - Optional deep-partial to override fields on top of the scenario
 */
function createScenarioContext(key, scenario, overrides) {
    const def = registry[key];
    if (!def)
        throw new Error('Unknown module: ' + key);
    const extensionBase = def.createBase();
    const scenarios = def.scenarios;
    const fn = scenarios ? scenarios[scenario] : undefined;
    const scenarioExt = (fn ? fn(extensionBase) : extensionBase);
    const base = (0, product_context_js_1.createDefaultEnvelope)(key, scenarioExt);
    return overrides ? (0, utils_js_1.deepMerge)(base, overrides) : base;
}
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
function createMockResolverContext(key, overrides) {
    const def = registry[key];
    if (!def)
        throw new Error('Unknown module: ' + key);
    const extensionBase = def.createBase();
    const base = (0, product_context_js_1.createDefaultResolverEnvelope)(key, extensionBase);
    return overrides ? (0, utils_js_1.deepMerge)(base, overrides) : base;
}
function getSupportedModules() {
    return Object.keys(registry);
}
function isModuleSupported(k) {
    return k in registry;
}
function listScenarios(key) {
    const def = registry[key];
    return def && def.scenarios ? Object.keys(def.scenarios) : [];
}
