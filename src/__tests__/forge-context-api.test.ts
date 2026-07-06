import { describe, it, expect } from '@jest/globals';
import { createBackendContext } from '@forge/testing-framework';

// Basic API contract tests for forge-context mock contexts
type BackendExtension = {
  type?: string;
  issue?: { key?: string };
  project?: { key?: string; id?: string; type?: string };
};

describe('forge-context API', () => {
  it('creates a backend context for issueActivity with overrides', () => {
    const ctx = createBackendContext('jira:issueActivity', {
      extension: { issue: { key: 'TEST-1' } },
    });
    const extension = ctx.extension as BackendExtension | undefined;
    expect(extension).toBeDefined();
    expect(extension?.issue?.key).toBe('TEST-1');
    expect(extension?.type).toBe('jira:issueActivity');
  });

  it('creates default context without overrides', () => {
    const ctx = createBackendContext('jira:issueActivity');
    const extension = ctx.extension as BackendExtension | undefined;
    expect(extension).toBeDefined();
    expect(extension?.type).toBe('jira:issueActivity');
    expect(extension?.issue).toBeDefined();
    expect(extension?.project).toBeDefined();
  });

  it('supports deep overrides', () => {
    const ctx = createBackendContext('jira:issueActivity', {
      extension: { project: { key: 'DEMO' } },
    });
    const extension = ctx.extension as BackendExtension | undefined;
    expect(extension).toBeDefined();
    expect(extension?.project?.key).toBe('DEMO');
    // Should preserve other project fields
    expect(extension?.project?.id).toBeDefined();
    expect(extension?.project?.type).toBeDefined();
  });
});
