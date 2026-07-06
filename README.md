# Jira Configuration Exporter (Forge)

Forge app for exporting Jira configuration data (projects, schemes, workflows, dashboards, filters, and more) from a Jira Admin page.

## Prerequisites

- Node.js 20+ (or the version required by your Forge CLI)
- npm
- Forge CLI:

  ```bash
  npm install -g @forge/cli
  ```

- Atlassian cloud site with Jira access (your Forge Developer Space/site)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Log in to Forge:

   ```bash
   forge login
   ```

3. Validate the project:

   ```bash
   npm run ci
   ```

## Install In Your Own Forge Developer Space

Use this flow when you want to install this app in your own Atlassian developer space.

1. Generate a new `app.id`:

   ```bash
   forge register
   ```

2. Deploy to the development environment:

   ```bash
   forge deploy
   ```

3. Install the app to your Jira site:

   ```bash
   forge install --product jira --environment development --site <your-site>.atlassian.net
   ```

4. For subsequent updates, redeploy and upgrade:

   ```bash
   forge deploy
   forge install --upgrade --product jira --environment development --site <your-site>.atlassian.net
   ```

After install, open Jira Admin and launch the **Jira Configuration Exporter** admin page.

## Local Development

- Run tunnel for live backend/frontend updates while testing:

  ```bash
  forge tunnel
  ```

## Project Structure

```text
src/
├── index.ts
├── resolvers/
│   ├── index.ts
│   ├── categories.ts
│   └── __tests__/
├── frontend/
│   ├── index.tsx
│   └── __tests__/
├── types/
└── __tests__/
manifest.yml
```

## Notes

- Use runtime imports (for example `xcss`) from `@forge/react`, not from `src/types`.
- Manifest changes require redeploy (`forge deploy`).

## References

- [Forge documentation](https://developer.atlassian.com/platform/forge/)
