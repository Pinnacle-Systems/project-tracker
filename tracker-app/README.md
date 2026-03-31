This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment

This project includes a GitHub Actions workflow for manual deployment to a VPS.

### Required GitHub Secrets

To use the deployment workflow, ensure the following secrets are configured in your GitHub repository:

- `SSH_PRIVATE_KEY`: The private SSH key used to access the VPS.
- `REMOTE_HOST`: The IP address or hostname of the VPS.
- `REMOTE_USER`: The SSH user for the VPS (e.g., `ubuntu` or `deploy`).
- `REMOTE_TARGET`: The target directory on the VPS where the application will be deployed (e.g., `/var/www/tracker-app`).
- `DATABASE_URL`: The full PostgreSQL connection string for the production database.

### Triggering a Deployment

1. Navigate to the **Actions** tab in your GitHub repository.
2. Select the **Deploy to VPS** workflow.
3. Click the **Run workflow** dropdown and select the branch you wish to deploy.
4. Click **Run workflow** to start the deployment.

The workflow will:
- Build the application in standalone mode.
- Rsync the build artifacts to the VPS.
- Run database migrations (`prisma migrate deploy`).
- Restart the application using PM2.

### Prerequisites: Database Permissions (PostgreSQL 15+)

If you are using PostgreSQL 15 or later, you may encounter a `permission denied for schema public` error during migrations. This is because default permissions on the `public` schema are more restrictive.

To fix this, run the following SQL as a superuser (e.g., `postgres`) on your database:

```sql
-- Replace 'your_db_user' with the user in your DATABASE_URL
GRANT USAGE, CREATE ON SCHEMA public TO your_db_user;
```

