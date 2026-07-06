import { createTestHarness } from '@forge/testing-framework';
import { handler } from '../resolvers';
import type { ExportRecord } from '../types';

const harness = createTestHarness({
  manifest: './manifest.yml',
  handlers: { resolver: handler },
});

beforeEach(() => harness.reset());

describe('App Integration', () => {
  it('should export configuration data for selected categories', async () => {
    // Set up fixtures for the categories we will export
    harness.addFixture('GET', '/rest/api/3/project/search?startAt=0&maxResults=50', {
      status: 200,
      body: {
        values: [
          { id: '1', key: 'PROJ', name: 'My Project', projectTypeKey: 'software' },
        ],
        startAt: 0,
        maxResults: 50,
        total: 1,
        isLast: true,
      },
    });
    harness.addFixture('GET', '/rest/api/3/issuetype', {
      status: 200,
      body: [
        { id: '10001', name: 'Bug', description: 'A problem' },
        { id: '10002', name: 'Task', description: 'A task' },
      ],
    });

    // 1. Run the export
    const exportResult = await harness.invoke<ExportRecord>('fetchConfigurationData', {
      payload: { categories: ['projects', 'workTypes'] },
    });

    expect(exportResult.data.id).toBeDefined();
    expect(exportResult.data.results).toHaveLength(2);
    expect(exportResult.data.results[0].status).toBe('done');
    expect(exportResult.data.results[1].status).toBe('done');

    expect(exportResult.data.categories).toEqual(['projects', 'workTypes']);
    expect(exportResult.data.results[0].rowCount).toBe(1);
    expect(exportResult.data.results[1].rowCount).toBe(2);
  });

  it('should handle partial failures — some categories succeed, others fail', async () => {
    harness.addFixture('GET', '/rest/api/3/project/search?startAt=0&maxResults=50', {
      status: 200,
      body: {
        values: [{ id: '1', key: 'PROJ', name: 'Project' }],
        isLast: true,
      },
    });
    harness.addFixture('GET', '/rest/api/3/permissionscheme', {
      status: 500,
      body: { errorMessages: ['Internal Server Error'] },
    });

    const result = await harness.invoke<ExportRecord>('fetchConfigurationData', {
      payload: { categories: ['projects', 'permissionSchemes'] },
    });

    expect(result.data.results).toHaveLength(2);
    expect(result.data.results[0].status).toBe('done');
    expect(result.data.results[1].status).toBe('error');

  });

  it('should export dashboards category', async () => {
    harness.addFixture('GET', '/rest/api/3/dashboard?startAt=0&maxResults=50', {
      status: 200,
      body: {
        dashboards: [
          { id: '10000', name: 'Team Dashboard' },
          { id: '10001', name: 'Ops Dashboard' },
        ],
        startAt: 0,
        maxResults: 50,
        isLast: true,
      },
    });

    const result = await harness.invoke<ExportRecord>('fetchConfigurationData', {
      payload: { categories: ['dashboards'] },
    });

    expect(result.data.results[0].status).toBe('done');
    expect(result.data.results[0].rowCount).toBe(2);
    expect(result.data.results[0].jsonTextContent).toContain('Team Dashboard');
  });
});
