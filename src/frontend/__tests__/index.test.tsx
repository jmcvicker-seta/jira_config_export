import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../index';

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Select Categories')).toBeTruthy();
    });
  });

  it('shows category checkboxes', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Core Config')).toBeTruthy();
      expect(screen.getByText('Schemes')).toBeTruthy();
      expect(screen.getByText('Boards & Filters')).toBeTruthy();

      const checkboxGroups = screen.getAllByTestId('forge-checkboxgroup');
      const serializedOptions = checkboxGroups
        .map((group) => group.getAttribute('data-options') || '')
        .join(' ');
      expect(serializedOptions).toContain('Projects');
      expect(serializedOptions).toContain('Permission Schemes');
      expect(serializedOptions).toContain('Filters');
    });
  });

  it('shows Select All button', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Select All')).toBeTruthy();
    });
  });

  it('shows Export button disabled when no categories selected', async () => {
    render(<App />);
    await waitFor(() => {
      const exportBtn = screen.getByText('Export');
      expect(exportBtn).toBeTruthy();
      // The button wrapper should have isDisabled as a data attribute
      const btnEl = exportBtn.closest('[data-testid="forge-button"]');
      expect(btnEl?.getAttribute('data-isdisabled')).toBe('true');
    });
  });

  it('renders grouped CheckboxGroups with alphabetical options', async () => {
    render(<App />);
    await waitFor(() => {
      const checkboxGroups = screen.getAllByTestId('forge-checkboxgroup');
      expect(checkboxGroups).toHaveLength(4);

      const coreConfigOptions = JSON.parse(
        checkboxGroups[0].getAttribute('data-options') || '[]',
      ) as Array<{ label: string; value: string }>;
      expect(coreConfigOptions.map((option) => option.label)).toEqual([
        'Custom Fields',
        'Groups',
        'Priorities',
        'Project Roles',
        'Projects',
        'Resolutions',
        'Statuses',
        'Work Types',
      ]);
    });
  });

  it('does not render Export History section', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText('Export History')).toBeNull();
    });
  });
});
