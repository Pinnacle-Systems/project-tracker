## Context

`tracker-app` is a standalone Next.js 16 (App Router) application with a PostgreSQL database accessed via Prisma (with `@prisma/adapter-pg`). There is no CI/CD pipeline. The Prisma generated client (`tracker-app/generated/`) is currently tracked in git — it should be a build artifact (gitignored, generated on the runner).

The target is a single VPS where both PostgreSQL and the Next.js app run. The app is managed by PM2. Deployment uses `easingthemes/ssh-deploy` for rsync over SSH.

## Goals / Non-Goals

**Goals:**
- Single `workflow_dispatch`-triggered GitHub Actions workflow for manual deploys
- Runner generates Prisma client and builds the Next.js app (standalone mode)
- Rsync built artifacts to VPS via SSH
- Run `prisma migrate deploy` on VPS as part of deploy
- Reload/start the app with PM2
- Fix `.gitignore` to exclude `generated/` and untrack existing files

**Non-Goals:**
- Automatic triggers (push to main, release events) — can be added later
- Docker-based deployment
- Preview environments or staging
- Rollback automation

## Decisions

### D1: Standalone Next.js output

Enable `output: 'standalone'` in `next.config.ts`. The standalone bundle includes only the required `node_modules` — no `pnpm install --prod` needed on the VPS for the app itself. Produces `.next/standalone/server.js` as the entry point.

**Alternative considered**: Ship full `node_modules` via rsync — rejected, too large and slow.

### D2: Generate Prisma client on runner, rsync to VPS

`prisma generate` runs on the CI runner after `pnpm install`. The output (`generated/`) is then included in the rsync source alongside `.next/standalone/` and `.next/static/`. The VPS does not regenerate it.

**Alternative considered**: Regenerate on VPS — rejected, keeps prod simple and avoids needing Prisma schema awareness on the server.

### D3: Single rsync step

Unlike the reference multi-app workflow, this is a single self-contained app. One rsync step covers everything. `SCRIPT_BEFORE` creates the target directory; `SCRIPT_AFTER` runs migrations and restarts PM2.

### D4: `prisma` CLI moved to `dependencies`

`prisma` CLI is moved from `devDependencies` to `dependencies` in `tracker-app/package.json`. This means `pnpm install --prod` on the VPS installs the CLI, making `pnpm exec prisma migrate deploy` work cleanly without any global installs or manual VPS setup.

The VPS `SCRIPT_AFTER` flow becomes:
```
pnpm install --prod --frozen-lockfile
pnpm exec prisma migrate deploy
pm2 reload project-tracker --update-env || pm2 start .next/standalone/server.js --name project-tracker
```

The standalone bundle does not include the Prisma CLI (it only bundles what's `require()`d by the app), so an explicit `pnpm install --prod` step is still needed for migrations. The rsync ships `package.json` and `pnpm-lock.yaml` to make this possible.

**Alternative considered**: Install `prisma` globally on VPS (`pnpm add -g prisma`) — rejected, manual undocumented setup that can drift out of sync with the project's pinned version.

**Alternative considered**: Rsync `node_modules/prisma/` directly — rejected, more complex and version management is implicit.

### D5: PM2 process name

`project-tracker` — consistent with repo naming.

### D6: Build-time data fetching (CI compatibility)

Since the GitHub Actions runner does not have connectivity to the production database, Next.js build-time pre-rendering (SSG) will fail for pages that fetch data from the database.

**Decision**: Explicitly mark database-dependent pages with `export const dynamic = 'force-dynamic'`. This instructs Next.js to skip pre-rendering those pages at build time and instead render them at request time on the VPS.

**Alternative considered**: Provide a dummy `DATABASE_URL` and mock data — rejected, too complex to maintain and fragile across model changes.

### D7: Script error reporting

Set `SCRIPT_AFTER_REQUIRED: true` in the `ssh-deploy` action. This ensures that if any command in the `SCRIPT_AFTER` block (like a migration failure or pnpm not being found) returns a non-zero exit code, the entire GitHub Actions job is marked as failed.

### D8: VPS Environment Setup (Non-interactive SSH)

Non-interactive SSH sessions often have an empty `PATH`. 
**Decision**: Explicitly source `nvm.sh`, set `NVM_DIR`, and run `corepack enable` at the start of `SCRIPT_AFTER`. This ensures that the correct versions of `node` and `pnpm` are available regardless of the VPS's default shell configuration.

### D9: Prisma Config Support (Prisma 6+)

The project uses `prisma.config.ts` to provide the `datasource.url`.
**Decision**: Include `prisma.config.ts` in the deployment artifacts and move `tsx` and `dotenv` from `devDependencies` to `dependencies`. This ensures that the Prisma CLI can load the TypeScript configuration file on the VPS using `tsx`.

### D10: Database Permissions (PostgreSQL 15+)

PostgreSQL 15+ has more restrictive permissions on the `public` schema by default. 
**Decision**: Document the requirement for the database user to have `CREATE` privileges on the `public` schema. This is necessary for `prisma migrate deploy` to create tables and the `_prisma_migrations` tracking table.

### D11: Server Port (VPS)

**Decision**: The application will run on port `9892` on the VPS. This is configured via the `PORT` environment variable in the `SCRIPT_AFTER` block of the deployment workflow.

## Risks / Trade-offs

- **DB migrations in SCRIPT_AFTER**: If migration fails, PM2 still reloads with stale code. Mitigation: put `migrate deploy` before `pm2 reload` and use `set -e` (fail-fast) in the script.
- **Standalone + Prisma client**: The standalone bundle copies needed files but Prisma's generated client and native binaries must be explicitly copied alongside `.next/standalone/`. Mitigation: explicit copy step in workflow.
- **First deploy**: PM2 process won't exist yet — `pm2 reload || pm2 start` handles this gracefully.
- **Secrets management**: `DATABASE_URL` is passed as env var in SCRIPT_AFTER. It contains the VPS localhost postgres credentials — must be set in GitHub Secrets, never hardcoded.

## Migration Plan

1. Move `prisma` from `devDependencies` to `dependencies` in `tracker-app/package.json`
2. Fix `.gitignore` in `tracker-app/` (update path from `/src/generated/prisma` → `/generated/`)
3. Run `git rm -r --cached tracker-app/generated/` to untrack
4. Add `output: 'standalone'` to `next.config.ts`
5. Create `.github/workflows/deploy.yml`
6. Add required secrets to GitHub repository settings
7. Mark database-dependent pages as `force-dynamic` for CI compatibility
8. Ensure robust environment setup in `SCRIPT_AFTER` (NVM + corepack)
9. Include `prisma.config.ts` and required loaders (tsx, dotenv) in deployment
10. Document PostgreSQL `public` schema permission prerequisite
11. Set server port to `9892` in `SCRIPT_AFTER`
12. Trigger first deploy via `workflow_dispatch`
