## 0. Dependency Changes

- [x] 0.1 Move `prisma` from `devDependencies` to `dependencies` in `tracker-app/package.json`

## 1. Fix Generated File Tracking

- [x] 1.1 Update `tracker-app/.gitignore` — replace `/src/generated/prisma` with `/generated/`
- [x] 1.2 Untrack the generated directory: `git rm -r --cached tracker-app/generated/`
- [x] 1.3 Commit the gitignore fix and untrack (e.g. `chore: untrack generated prisma client`)

## 2. Enable Next.js Standalone Output

- [x] 2.1 Add `output: 'standalone'` to `tracker-app/next.config.ts`
- [x] 2.2 Verify `pnpm build` produces `.next/standalone/server.js` locally

## 3. Create GitHub Actions Workflow

- [x] 3.1 Create `.github/workflows/deploy.yml` with `workflow_dispatch` trigger
- [x] 3.2 Add runner steps: `actions/checkout`, `corepack enable`, `actions/setup-node` (with pnpm cache), `pnpm install --frozen-lockfile`, `pnpm exec prisma generate`, `pnpm build`
- [x] 3.3 Add `easingthemes/ssh-deploy` step — `SCRIPT_BEFORE` creates `REMOTE_TARGET` dir, source includes `.next/standalone .next/static .next/server generated prisma public package.json pnpm-lock.yaml`
- [x] 3.4 Add `SCRIPT_AFTER` to deploy step: source nvm, set `NODE_ENV=production` and `DATABASE_URL`, run `prisma migrate deploy`, run `pm2 reload project-tracker --update-env || pm2 start standalone/server.js --name project-tracker`
- [x] 3.5 Use `set -e` at top of `SCRIPT_AFTER` to ensure fail-fast on migration error

## 4. Update README

- [x] 4.1 Add a **Deployment** section to `tracker-app/README.md` listing required GitHub Secrets: `SSH_PRIVATE_KEY`, `REMOTE_HOST`, `REMOTE_USER`, `REMOTE_TARGET`, `DATABASE_URL`
- [x] 4.2 Document how to trigger the workflow (GitHub Actions UI → Run workflow)

## 5. Build-time Data Fetching Fixes (CI Compatibility)

- [x] 5.1 Mark `tracker-app/src/app/page.tsx` as `force-dynamic`
- [x] 5.2 Mark `tracker-app/src/app/customers/page.tsx` as `force-dynamic`
- [x] 5.3 Mark `tracker-app/src/app/projects/page.tsx` as `force-dynamic`
- [x] 5.4 Mark `tracker-app/src/app/projects/[id]/page.tsx` as `force-dynamic`

## 6. Implementation Robustness (Fixes)

- [x] 6.1 Add `SCRIPT_AFTER_REQUIRED: true` to `easingthemes/ssh-deploy` step
- [x] 6.2 Ensure `SCRIPT_AFTER` explicitly sources NVM and enables corepack for path resolution
