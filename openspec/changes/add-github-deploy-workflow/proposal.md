## Why

Deployments to the VPS are currently manual with no automation. There is also no CI pipeline, so `tracker-app/generated/prisma/` (the Prisma client build artifact) is incorrectly tracked in git, causing noisy diffs on schema changes.

## What Changes

- Add a GitHub Actions workflow (`workflow_dispatch`) that builds and deploys the app to the VPS via SSH/rsync
- Fix `.gitignore` to exclude `tracker-app/generated/` (untrack the Prisma generated client)
- Add `prisma generate` step to the CI runner so the generated client is produced as a build artifact and rsynced to VPS
- Add `output: 'standalone'` to `next.config.ts` for lean deployment artifacts
- Document required GitHub secrets in `README.md`

## Capabilities

### New Capabilities
- `github-deploy-workflow`: A `workflow_dispatch`-triggered CI/CD pipeline that builds the Next.js app on the runner, generates the Prisma client, and deploys via rsync to a VPS; runs `prisma migrate deploy` and restarts the app with PM2 on the server

### Modified Capabilities
- none

## Impact

- **New file**: `.github/workflows/deploy.yml`
- **Modified**: `tracker-app/.gitignore` — correct the generated path from `/src/generated/prisma` to `/generated/`
- **Modified**: `tracker-app/next.config.ts` — add `output: 'standalone'`
- **Modified**: `tracker-app/README.md` — deployment section with required secrets
- **Git history**: `tracker-app/generated/` files will be untracked (`git rm -r --cached`)
- **GitHub Secrets required**: `SSH_PRIVATE_KEY`, `REMOTE_HOST`, `REMOTE_USER`, `REMOTE_TARGET`, `DATABASE_URL`
