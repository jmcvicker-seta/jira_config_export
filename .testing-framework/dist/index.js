"use strict";
/**
 * @forge/testing-framework
 *
 * A testing framework for Forge apps that provides fake implementations
 * of @forge/api, @forge/kvs, @forge/bridge, and other Forge runtime APIs.
 *
 * This enables testing Forge app logic in isolation without deploying to
 * an Atlassian product.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyEventsError = exports.RateLimitError = exports.resetForgeEventsShim = exports.getPushedEvents = exports.getAllPushedEvents = exports.Queue = exports.makeResolver = exports.Resolver = exports.resetForgeReactShim = exports.FakeForgeReconciler = exports.resetForgeJiraBridgeShim = exports.jiraBridge = exports.fakeWorkflowRules = exports.fakeUiModifications = exports.FakeCreateIssueModal = exports.FakeViewIssueModal = exports.FakeBridge = exports.Sort = exports.MetadataField = exports.ForgeKvsAPIError = exports.ForgeKvsError = exports.FilterConditions = exports.WhereConditions = exports.FakeKvs = exports.isExpectedError = exports.isHostedCodeError = exports.isForgePlatformError = exports.ProxyRequestError = exports.InvalidContainerServiceError = exports.InvalidRemoteError = exports.NeedsAuthenticationError = exports.InvalidWorkspaceRequestedError = exports.RequestProductNotAllowedError = exports.ProductEndpointNotAllowedError = exports.ExternalEndpointNotAllowedError = exports.NotAllowedError = exports.FetchError = exports.HttpError = exports.FUNCTION_ERR = exports.route = exports.Route = exports.resetForgeApiShim = exports.FakeApi = exports.createMockResponse = exports.CallRecorder = exports._storage = exports._api = exports.FixtureStore = exports.parseManifestFile = exports.parseManifest = void 0;
exports.validateFixture = exports.validateAgainstSchema = exports.SpecLoader = exports.SPEC_SOURCES = exports.listTags = exports.listProducts = exports.listAPIs = exports.getAPIReference = exports.generateFromSchema = exports.generateFixture = exports.downloadSpecs = exports.forgeTestConfig = exports.forgeModuleNameMapper = exports.listScenarios = exports.isModuleSupported = exports.getSupportedModules = exports.createScenarioContext = exports.TestHarness = exports.invokeWebTrigger = exports.EventQueue = exports.createTestHarness = exports.createFrontendContext = exports.createBackendContext = exports.PartialSuccessError = exports.InvocationLimitReachedError = exports.InvalidQueueNameError = exports.PayloadTooBigError = void 0;
// Manifest parser
var index_js_1 = require("./manifest/index.js");
Object.defineProperty(exports, "parseManifest", { enumerable: true, get: function () { return index_js_1.parseManifest; } });
Object.defineProperty(exports, "parseManifestFile", { enumerable: true, get: function () { return index_js_1.parseManifestFile; } });
// Fixture system
var index_js_2 = require("./fixtures/index.js");
Object.defineProperty(exports, "FixtureStore", { enumerable: true, get: function () { return index_js_2.FixtureStore; } });
// Fake @forge/api
var index_js_3 = require("./shims/forge-api/index.js");
Object.defineProperty(exports, "_api", { enumerable: true, get: function () { return index_js_3._api; } });
Object.defineProperty(exports, "_storage", { enumerable: true, get: function () { return index_js_3._storage; } });
Object.defineProperty(exports, "CallRecorder", { enumerable: true, get: function () { return index_js_3.CallRecorder; } });
Object.defineProperty(exports, "createMockResponse", { enumerable: true, get: function () { return index_js_3.createMockResponse; } });
Object.defineProperty(exports, "FakeApi", { enumerable: true, get: function () { return index_js_3.FakeApi; } });
Object.defineProperty(exports, "resetForgeApiShim", { enumerable: true, get: function () { return index_js_3.resetForgeApiShim; } });
Object.defineProperty(exports, "Route", { enumerable: true, get: function () { return index_js_3.Route; } });
Object.defineProperty(exports, "route", { enumerable: true, get: function () { return index_js_3.route; } });
// @forge/api error classes
var errors_js_1 = require("./shims/forge-api/errors.js");
Object.defineProperty(exports, "FUNCTION_ERR", { enumerable: true, get: function () { return errors_js_1.FUNCTION_ERR; } });
Object.defineProperty(exports, "HttpError", { enumerable: true, get: function () { return errors_js_1.HttpError; } });
Object.defineProperty(exports, "FetchError", { enumerable: true, get: function () { return errors_js_1.FetchError; } });
Object.defineProperty(exports, "NotAllowedError", { enumerable: true, get: function () { return errors_js_1.NotAllowedError; } });
Object.defineProperty(exports, "ExternalEndpointNotAllowedError", { enumerable: true, get: function () { return errors_js_1.ExternalEndpointNotAllowedError; } });
Object.defineProperty(exports, "ProductEndpointNotAllowedError", { enumerable: true, get: function () { return errors_js_1.ProductEndpointNotAllowedError; } });
Object.defineProperty(exports, "RequestProductNotAllowedError", { enumerable: true, get: function () { return errors_js_1.RequestProductNotAllowedError; } });
Object.defineProperty(exports, "InvalidWorkspaceRequestedError", { enumerable: true, get: function () { return errors_js_1.InvalidWorkspaceRequestedError; } });
Object.defineProperty(exports, "NeedsAuthenticationError", { enumerable: true, get: function () { return errors_js_1.NeedsAuthenticationError; } });
Object.defineProperty(exports, "InvalidRemoteError", { enumerable: true, get: function () { return errors_js_1.InvalidRemoteError; } });
Object.defineProperty(exports, "InvalidContainerServiceError", { enumerable: true, get: function () { return errors_js_1.InvalidContainerServiceError; } });
Object.defineProperty(exports, "ProxyRequestError", { enumerable: true, get: function () { return errors_js_1.ProxyRequestError; } });
Object.defineProperty(exports, "isForgePlatformError", { enumerable: true, get: function () { return errors_js_1.isForgePlatformError; } });
Object.defineProperty(exports, "isHostedCodeError", { enumerable: true, get: function () { return errors_js_1.isHostedCodeError; } });
Object.defineProperty(exports, "isExpectedError", { enumerable: true, get: function () { return errors_js_1.isExpectedError; } });
// Fake @forge/kvs
var index_js_4 = require("./shims/forge-kvs/index.js");
Object.defineProperty(exports, "FakeKvs", { enumerable: true, get: function () { return index_js_4.FakeKvs; } });
Object.defineProperty(exports, "WhereConditions", { enumerable: true, get: function () { return index_js_4.WhereConditions; } });
Object.defineProperty(exports, "FilterConditions", { enumerable: true, get: function () { return index_js_4.FilterConditions; } });
Object.defineProperty(exports, "ForgeKvsError", { enumerable: true, get: function () { return index_js_4.ForgeKvsError; } });
Object.defineProperty(exports, "ForgeKvsAPIError", { enumerable: true, get: function () { return index_js_4.ForgeKvsAPIError; } });
Object.defineProperty(exports, "MetadataField", { enumerable: true, get: function () { return index_js_4.MetadataField; } });
Object.defineProperty(exports, "Sort", { enumerable: true, get: function () { return index_js_4.Sort; } });
// Fake @forge/bridge
var index_js_5 = require("./shims/forge-bridge/index.js");
Object.defineProperty(exports, "FakeBridge", { enumerable: true, get: function () { return index_js_5.FakeBridge; } });
// Fake @forge/jira-bridge
var index_js_6 = require("./shims/forge-jira-bridge/index.js");
Object.defineProperty(exports, "FakeViewIssueModal", { enumerable: true, get: function () { return index_js_6.ViewIssueModal; } });
Object.defineProperty(exports, "FakeCreateIssueModal", { enumerable: true, get: function () { return index_js_6.CreateIssueModal; } });
Object.defineProperty(exports, "fakeUiModifications", { enumerable: true, get: function () { return index_js_6.uiModifications; } });
Object.defineProperty(exports, "fakeWorkflowRules", { enumerable: true, get: function () { return index_js_6.workflowRules; } });
Object.defineProperty(exports, "jiraBridge", { enumerable: true, get: function () { return index_js_6.jiraBridge; } });
Object.defineProperty(exports, "resetForgeJiraBridgeShim", { enumerable: true, get: function () { return index_js_6.resetForgeJiraBridgeShim; } });
// Fake @forge/react
var index_js_7 = require("./shims/forge-react/index.js");
Object.defineProperty(exports, "FakeForgeReconciler", { enumerable: true, get: function () { return __importDefault(index_js_7).default; } });
Object.defineProperty(exports, "resetForgeReactShim", { enumerable: true, get: function () { return index_js_7.resetForgeReactShim; } });
// Fake @forge/resolver
var index_js_8 = require("./shims/forge-resolver/index.js");
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return index_js_8.Resolver; } });
Object.defineProperty(exports, "makeResolver", { enumerable: true, get: function () { return index_js_8.makeResolver; } });
// Fake @forge/events
var index_js_9 = require("./shims/forge-events/index.js");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return index_js_9.Queue; } });
Object.defineProperty(exports, "getAllPushedEvents", { enumerable: true, get: function () { return index_js_9.getAllPushedEvents; } });
Object.defineProperty(exports, "getPushedEvents", { enumerable: true, get: function () { return index_js_9.getPushedEvents; } });
Object.defineProperty(exports, "resetForgeEventsShim", { enumerable: true, get: function () { return index_js_9.resetForgeEventsShim; } });
Object.defineProperty(exports, "RateLimitError", { enumerable: true, get: function () { return index_js_9.RateLimitError; } });
Object.defineProperty(exports, "TooManyEventsError", { enumerable: true, get: function () { return index_js_9.TooManyEventsError; } });
Object.defineProperty(exports, "PayloadTooBigError", { enumerable: true, get: function () { return index_js_9.PayloadTooBigError; } });
Object.defineProperty(exports, "InvalidQueueNameError", { enumerable: true, get: function () { return index_js_9.InvalidQueueNameError; } });
Object.defineProperty(exports, "InvocationLimitReachedError", { enumerable: true, get: function () { return index_js_9.InvocationLimitReachedError; } });
Object.defineProperty(exports, "PartialSuccessError", { enumerable: true, get: function () { return index_js_9.PartialSuccessError; } });
// Test harness
var index_js_10 = require("./harness/index.js");
Object.defineProperty(exports, "createBackendContext", { enumerable: true, get: function () { return index_js_10.createBackendContext; } });
Object.defineProperty(exports, "createFrontendContext", { enumerable: true, get: function () { return index_js_10.createFrontendContext; } });
Object.defineProperty(exports, "createTestHarness", { enumerable: true, get: function () { return index_js_10.createTestHarness; } });
Object.defineProperty(exports, "EventQueue", { enumerable: true, get: function () { return index_js_10.EventQueue; } });
Object.defineProperty(exports, "invokeWebTrigger", { enumerable: true, get: function () { return index_js_10.invokeWebTrigger; } });
Object.defineProperty(exports, "TestHarness", { enumerable: true, get: function () { return index_js_10.TestHarness; } });
// Context discovery and scenario utilities
var forge_context_1 = require("@my/forge-context");
Object.defineProperty(exports, "createScenarioContext", { enumerable: true, get: function () { return forge_context_1.createScenarioContext; } });
Object.defineProperty(exports, "getSupportedModules", { enumerable: true, get: function () { return forge_context_1.getSupportedModules; } });
Object.defineProperty(exports, "isModuleSupported", { enumerable: true, get: function () { return forge_context_1.isModuleSupported; } });
Object.defineProperty(exports, "listScenarios", { enumerable: true, get: function () { return forge_context_1.listScenarios; } });
// Jest config helper
var index_js_11 = require("./config/index.js");
Object.defineProperty(exports, "forgeModuleNameMapper", { enumerable: true, get: function () { return index_js_11.forgeModuleNameMapper; } });
Object.defineProperty(exports, "forgeTestConfig", { enumerable: true, get: function () { return index_js_11.forgeTestConfig; } });
// OpenAPI infrastructure
var index_js_12 = require("./openapi/index.js");
Object.defineProperty(exports, "downloadSpecs", { enumerable: true, get: function () { return index_js_12.downloadSpecs; } });
Object.defineProperty(exports, "generateFixture", { enumerable: true, get: function () { return index_js_12.generateFixture; } });
Object.defineProperty(exports, "generateFromSchema", { enumerable: true, get: function () { return index_js_12.generateFromSchema; } });
Object.defineProperty(exports, "getAPIReference", { enumerable: true, get: function () { return index_js_12.getAPIReference; } });
Object.defineProperty(exports, "listAPIs", { enumerable: true, get: function () { return index_js_12.listAPIs; } });
Object.defineProperty(exports, "listProducts", { enumerable: true, get: function () { return index_js_12.listProducts; } });
Object.defineProperty(exports, "listTags", { enumerable: true, get: function () { return index_js_12.listTags; } });
Object.defineProperty(exports, "SPEC_SOURCES", { enumerable: true, get: function () { return index_js_12.SPEC_SOURCES; } });
Object.defineProperty(exports, "SpecLoader", { enumerable: true, get: function () { return index_js_12.SpecLoader; } });
Object.defineProperty(exports, "validateAgainstSchema", { enumerable: true, get: function () { return index_js_12.validateAgainstSchema; } });
Object.defineProperty(exports, "validateFixture", { enumerable: true, get: function () { return index_js_12.validateFixture; } });
// OpenAPI ground truth capture (not re-exported from top level — use directly)
// import { captureAPIResponses, sanitizeResponse } from './openapi/capture-api-responses.js';
