# Default fixtures

This folder contains the JSON fixtures the `FixtureStore` returns when an app
makes a product API call (via `@forge/api` or `@forge/bridge`) and no override
or programmatic handler is registered.

Each fixture aims to match the **real shape** of the corresponding endpoint
response, so app code (and Forge SDK helpers) work without surprises. A few
endpoints have non-obvious response shapes that are worth highlighting.

## Jira

### `jira/search-jql.json` — `/rest/api/3/search/jql`

The v3 `search/jql` endpoint returns `{ issues, isLast, names, nextPageToken,
schema }` — and crucially **does NOT** return a `total` field. This is
intentional and matches the real Jira REST API.

If you need a total count, use the older `/rest/api/3/search/picker` or
`/rest/api/3/search/count` endpoints, or paginate using `nextPageToken` until
`isLast: true`.

### `jira/myself.json` — `/rest/api/3/myself`

Returns the standard `User` shape (`accountId`, `displayName`, `emailAddress`,
etc.). Override per-test if you need a specific user identity.

## Confluence

### `confluence/page-properties.json` — `/wiki/api/v2/pages/{id}/properties`

The v2 properties endpoint always returns `{ results: [...], _links: {...} }` —
**even when filtering by a single property key**. The single matching property
shows up inside the `results` array; the response is never the property object
on its own. If your app expects a single property and unwraps with
`response.results[0]`, that matches real behaviour.

## How to override a default

```typescript
// In a test
harness.addFixture('GET', '/rest/api/3/myself', {
  status: 200,
  body: { accountId: 'admin-1', displayName: 'Admin' },
});
```

For programmatic handling across many paths, register a `FixtureHandler`:

```typescript
harness.addFixtureHandler((method, path) => {
  if (method === 'GET' && path.startsWith('/rest/api/3/project/')) {
    return { status: 200, body: { key: 'CUSTOM' } };
  }
  // return undefined to fall through to the default fixture
});
```
