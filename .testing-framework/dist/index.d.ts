/**
 * @forge/testing-framework
 *
 * A testing framework for Forge apps that provides fake implementations
 * of @forge/api, @forge/kvs, @forge/bridge, and other Forge runtime APIs.
 *
 * This enables testing Forge app logic in isolation without deploying to
 * an Atlassian product.
 */
export { parseManifest, parseManifestFile } from './manifest/index.js';
export type { EntityAttribute, EntityDefinition, EntityIndex, FunctionDefinition, ManifestConfig, ModuleDefinition, NamedIndex, Permissions, ResourceDefinition, SimpleIndex, } from './manifest/index.js';
export { FixtureStore } from './fixtures/index.js';
export type { Fixture, FixtureHandler, FixtureLookupResult, FixtureResponse, FixtureStoreOptions, } from './fixtures/index.js';
export { _api, _storage, CallRecorder, createMockResponse, FakeApi, resetForgeApiShim, Route, route } from './shims/forge-api/index.js';
export type { FakeApiOptions, MockApiResponse, ProductRequestInit, ProductRequestMethods, AsUserRequestMethods, AsAppRequestMethods, ExternalAuthFetchMethods, ExternalAuthAccountMethods, ExternalAuthAccount, RecordedApiCall, } from './shims/forge-api/index.js';
export { FUNCTION_ERR, HttpError, FetchError, NotAllowedError, ExternalEndpointNotAllowedError, ProductEndpointNotAllowedError, RequestProductNotAllowedError, InvalidWorkspaceRequestedError, NeedsAuthenticationError, InvalidRemoteError, InvalidContainerServiceError, ProxyRequestError, isForgePlatformError, isHostedCodeError, isExpectedError, } from './shims/forge-api/errors.js';
export type { NeedsAuthenticationErrorOptions } from './shims/forge-api/errors.js';
export { FakeKvs, WhereConditions, FilterConditions, ForgeKvsError, ForgeKvsAPIError, MetadataField, Sort } from './shims/forge-kvs/index.js';
export type { FakeKvsOptions } from './shims/forge-kvs/index.js';
export { FakeBridge } from './shims/forge-bridge/index.js';
export type { FlagOptions, FullContext, InvokeEndpointInput, ModalOptions, ProductRequestFixture, RecordedEvent, RecordedFlag, RecordedInvoke, RecordedModal, RecordedNavigation, RecordedProductRequest, RecordedRealtimeAction, RecordedViewAction, } from './shims/forge-bridge/index.js';
export { ViewIssueModal as FakeViewIssueModal, CreateIssueModal as FakeCreateIssueModal, uiModifications as fakeUiModifications, workflowRules as fakeWorkflowRules, jiraBridge, resetForgeJiraBridgeShim, } from './shims/forge-jira-bridge/index.js';
export type { RecordedViewIssueModalOpen, RecordedCreateIssueModalOpen, RecordedUiModificationAction, RecordedWorkflowRuleAction, ViewIssueModalOptions, CreateIssueModalOptions, } from './shims/forge-jira-bridge/index.js';
export { default as FakeForgeReconciler, resetForgeReactShim } from './shims/forge-react/index.js';
export { Resolver, makeResolver } from './shims/forge-resolver/index.js';
export type { ResolverHandler, ResolverRequest } from './shims/forge-resolver/index.js';
export { Queue, getAllPushedEvents, getPushedEvents, resetForgeEventsShim, RateLimitError, TooManyEventsError, PayloadTooBigError, InvalidQueueNameError, InvocationLimitReachedError, PartialSuccessError, } from './shims/forge-events/index.js';
export type { AsyncEvent, Body, Concurrency, JobStats, PushEvent, PushResult, RecordedPushEvent, } from './shims/forge-events/index.js';
export { createBackendContext, createFrontendContext, createTestHarness, EventQueue, invokeWebTrigger, TestHarness } from './harness/index.js';
export type * from '@my/forge-context';
export { createScenarioContext, getSupportedModules, isModuleSupported, listScenarios, } from '@my/forge-context';
export type { EventProcessingResult, InvokeContext, InvokeOptions, InvokePayload, InvokeResult, QueuedEvent, TestHarnessConfig, WebTriggerRequest, WebTriggerResponse, } from './harness/index.js';
export { forgeModuleNameMapper, forgeTestConfig } from './config/index.js';
export type { ForgeJestConfig } from './config/index.js';
export { downloadSpecs, generateFixture, generateFromSchema, getAPIReference, listAPIs, listProducts, listTags, SPEC_SOURCES, SpecLoader, validateAgainstSchema, validateFixture, } from './openapi/index.js';
export type { APIEndpointSummary, GenerateFixtureOptions, ListAPIsOptions, ResolvedOperation, ResolvedParameter, ResolvedRequestBody, ResolvedResponse, SpecSource, ValidateFixtureOptions, ValidationError, ValidationResult, } from './openapi/index.js';
