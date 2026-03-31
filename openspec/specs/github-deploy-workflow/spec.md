## ADDED Requirements

### Requirement: CI runner builds app and generates Prisma client
The CI runner SHALL install dependencies, run `prisma generate`, and run `next build` before deploying. The `generated/` directory SHALL NOT be tracked in git.

#### Scenario: Successful runner build
- **WHEN** the workflow is dispatched
- **THEN** the runner runs `pnpm install --frozen-lockfile`, `pnpm exec prisma generate`, and `pnpm build` in sequence, producing `.next/standalone/` and `generated/prisma/`

#### Scenario: Build fails
- **WHEN** any build step exits with a non-zero code
- **THEN** the workflow MUST halt and not proceed to the deploy step

---

### Requirement: Deploy artifacts rsynced to VPS
Built artifacts SHALL be transferred to the VPS via SSH/rsync using the `easingthemes/ssh-deploy` action.

#### Scenario: Artifacts transferred
- **WHEN** the build succeeds
- **THEN** `.next/standalone/`, `.next/static/`, `.next/server/`, `generated/`, `prisma/`, `public/`, `package.json`, and `pnpm-lock.yaml` are rsynced to `REMOTE_TARGET` on the VPS

#### Scenario: SSH auth fails
- **WHEN** the SSH private key or remote host secret is invalid
- **THEN** the workflow MUST fail with a clear SSH error before any changes are made on the VPS

---

### Requirement: Database migrations run on VPS before app restart
`prisma migrate deploy` SHALL run on the VPS as part of the deployment, before PM2 reloads the app.

#### Scenario: Migrations applied
- **WHEN** artifacts are rsynced to VPS
- **THEN** the deploy script runs `prisma migrate deploy` against the local PostgreSQL instance before restarting the app

#### Scenario: Migration fails
- **WHEN** `prisma migrate deploy` exits non-zero
- **THEN** the script MUST halt (via `set -e`) and PM2 SHALL NOT be reloaded

---

### Requirement: App restarted with PM2 after deploy
The Next.js standalone server SHALL be managed by PM2 with the process name `project-tracker`.

#### Scenario: Existing process reloaded
- **WHEN** a PM2 process named `project-tracker` already exists
- **THEN** `pm2 reload project-tracker --update-env` is called to apply the new build and env vars

#### Scenario: First deploy
- **WHEN** no PM2 process named `project-tracker` exists
- **THEN** `pm2 start .next/standalone/server.js --name project-tracker` is called

---

### Requirement: Workflow triggered manually only
The deploy workflow SHALL only be triggered via `workflow_dispatch`. No push or release triggers.

#### Scenario: Manual trigger
- **WHEN** a user clicks "Run workflow" in the GitHub Actions UI
- **THEN** the full build-and-deploy pipeline runs

---

### Requirement: Generated Prisma client excluded from git
`tracker-app/generated/` SHALL be listed in `.gitignore` and SHALL NOT be tracked in the repository.

#### Scenario: Schema change committed
- **WHEN** `prisma/schema.prisma` is modified and committed
- **THEN** no changes to `generated/` appear in `git status` or `git diff --staged`
