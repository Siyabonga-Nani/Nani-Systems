# Nani Systems V1 — Master Deployment & Infrastructure Guide

This is the authoritative V1 deployment and infrastructure handover document for Nani Systems. It defines the deployment topology, repository structure, security practices, and operational boundaries necessary to securely run and maintain Nani Systems V1 in production.

---

## 1. GITHUB FILE MAP

The GitHub repository acts as the single source of truth for the application structure.

### ✅ MUST BE COMMITTED
These files define the application, its dependencies, and deployment structure.

| File/Directory | GitHub? | Reason |
| :--- | :---: | :--- |
| `src/` | ✅ | Contains all Next.js application source code, UI components, API routes, and Server Actions. |
| `public/` | ✅ | Contains static assets (images, fonts, favicons). |
| `prisma/schema.prisma` | ✅ | The definitive database schema definition. |
| `prisma/migrations/` | ✅ | Contains strictly versioned database migration files (e.g. `20260909043200_v1_baseline`). |
| `package.json` & `package-lock.json` | ✅ | Defines required NPM dependencies and scripts (e.g. `build`). |
| `next.config.ts` | ✅ | Next.js configuration rules. |
| `tsconfig.json` | ✅ | TypeScript compilation configuration. |
| `tailwind.config.ts` | ✅ | Tailwind styling rules. |
| `components.json` | ✅ | Shadcn UI component configuration. |
| `.gitignore` | ✅ | Prevents secrets and generated files from entering version control. |
| `.env.example` | ✅ | A template of required variables (contains NO real secrets). |

### 🚨 NEVER COMMIT THESE
The following files **must remain on your local machine** and are actively blocked by `.gitignore`.

| File/Directory | GitHub? | Reason |
| :--- | :---: | :--- |
| `.env`, `.env.local`, `.env.production` | ❌ | Contains live production secrets, `DATABASE_URL`, and Admin passwords. |
| `node_modules/` | ❌ | Automatically installed during deployment. Highly redundant. |
| `.next/` and `build/` | ❌ | Generated build artifacts. |
| `pg/data/` | ❌ | Local PostgreSQL database clusters. |
| `*.log` (e.g., `npm-debug.log`) | ❌ | Local debugging outputs. |
| `.vercel/` | ❌ | Local Vercel CLI linking configuration. |

---

## 2. SECRETS MANAGEMENT

Secrets must never be hardcoded into the source code (`src/`). The distribution of secrets operates strictly as follows:

- **GitHub:** ❌ NO production secrets. 
- **Vercel Environment Variables:** ✅ Production secrets (Admin passwords, JWT signing keys).
- **PostgreSQL Provider:** ✅ Database connection credentials.
- **Local `.env`:** ✅ Development-only mock secrets.

---

## 3. ENVIRONMENT VARIABLES MASTER TABLE

The following variables dictate the application's production context. They must be configured in Vercel's Environment Variables dashboard.

| Variable | Required? | Secret? | Where configured | Purpose |
| :--- | :---: | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | ✅ | Vercel & Local | Connection string to the PostgreSQL database. |
| `ADMIN_PASSWORD` | **Yes** | ✅ | Vercel & Local | The global password required to access the `/admin` dashboard. |
| `ADMIN_SECRET` | **Yes** | ✅ | Vercel & Local | A secure 32+ character key used by `jose` to cryptographically sign session JWTs. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | ❌ | Vercel & Local | The canonical URL of the application (e.g., `https://nanisystems.com`). Used for absolute links. |
| `PAYPAL_ENVIRONMENT` | Deferred | ❌ | Vercel | Set to `sandbox` or `production`. |
| `PAYPAL_CLIENT_ID` | Deferred | ❌ | Vercel | PayPal public application key. |
| `PAYPAL_SECRET` | Deferred | ✅ | Vercel | PayPal private application secret. |
| `ADMIN_EMAIL` | Optional | ❌ | Vercel & Local | Where internal notifications should route (fallback mock logging enabled). |
| `EMAIL_PROVIDER_NAME` | Deferred | ❌ | Vercel | Used when integrating live SMTP (e.g. `resend`). |
| `EMAIL_PROVIDER_API_KEY`| Deferred | ✅ | Vercel | SMTP provider secret token. |

---

## 4. VERCEL DEPLOYMENT MAP

Vercel hosts the Next.js frontend, Server Actions, and API Route Handlers. **There is no separate backend host.**

- **Framework:** Next.js
- **Node Runtime:** Node.js 20.x+
- **Build Command:** `npm run build` (Mapped to `prisma generate && prisma migrate deploy && next build` in `package.json`).
- **Install Command:** Automatically runs `npm install`.

**The Vercel Deployment Sequence:**
1. Vercel pulls code from GitHub.
2. Runs `npm install`.
3. Runs `prisma generate` to build the ORM client.
4. Runs `prisma migrate deploy` to safely apply any pending migrations to the PostgreSQL database.
5. Runs `next build` to compile the React application and API routes.
6. Provisions the Serverless Functions and Edge Network.

---

## 5. POSTGRESQL MAP

PostgreSQL is the mandatory production database. It **must** be hosted independently from Vercel's serverless environment (e.g., Vercel Postgres, Supabase, Neon).

- Vercel connects to PostgreSQL via the `DATABASE_URL` environment variable.
- The schema is rigidly defined in `prisma/schema.prisma`.
- The database relies entirely on the Prisma Migration history to form its structure.

---

## 6. PRISMA MIGRATION PROCEDURE

### Local Development
Developers updating the `schema.prisma` locally must run:
`npx prisma migrate dev --name <migration_name>`
This updates the local database and generates a new `.sql` file in `prisma/migrations/` which must be committed to GitHub.

### Production
**The approved command is:**
`npx prisma migrate deploy`
This is natively built into the `package.json` build script.

**🚨 CRITICAL WARNING:**
- **DO NOT USE `prisma db push` FOR PRODUCTION.** It recklessly attempts to synchronize schemas without history, risking severe data loss.
- **DO NOT USE `prisma migrate reset` FOR PRODUCTION.** It drops the entire database.

**Current Baseline:**
The initial production database must be initialized via the `20260909043200_v1_baseline` migration present in the repository.

---

## 7. DOMAIN / DNS

- **Canonical URL:** TBD / NOT YET CONFIGURED.
- **Where Configured:** Must be added to Vercel's "Domains" settings.
- **DNS Records:** Usually an `A` record or `CNAME` pointing to Vercel's edge network.
- **HTTPS:** Managed automatically by Vercel.
- **Crucial Step:** Once the domain is attached, `NEXT_PUBLIC_APP_URL` MUST be updated to match it exactly so that authentication redirects and email links function properly.

---

## 8. AUTHENTICATION MAP

The system uses mathematically separated Server-Side JWTs.
There is exactly one public entry point: `/login` (and `/register`). The server inherently determines the user's role—the browser is never trusted.

- **Account Holder:**
  - Routes: `/register`, `/login`, `/account`
  - Profile without commercial capabilities.
- **Client:**
  - Routes: `/login`, `/portal`, `/portal/activate/[token]`
  - Access to active projects, invoices, and contracts.
- **Admin:**
  - Routes: `/login` → `/admin`
  - Requires the master `ADMIN_PASSWORD` and `ADMIN_EMAIL`. Not publicly advertised.

---

## 9. COMMERCIAL SYSTEM MAP

The operational workflow operates deterministically:
1. **Visitor** submits a form → creates **Lead**
2. **Lead** submits **Quote Request**
3. Admin issues **Quotation**
4. Quotation accepted → generates **Contract**
5. Contract signed → creates **Client** (and links to an existing **Account** if they are registered)
6. Client issued **Invoice**
7. Invoice receives **Payment**
8. Project transitions to **Project Onboarding**
9. Project completes → transitions to **Ongoing Services**

*This entire workflow is tracked strictly within the PostgreSQL database.*

---

## 10. EMAIL & PAYMENT STATUS

- **EMAIL PROVIDER:** 🟡 **DEFERRED.** 
  Currently mocks notifications to the system console. A manual workaround exists allowing Admins to copy/paste secure portal activation links.
- **PAYMENTS:** 🟡 **MANUAL EFT / PAYPAL OPTIONAL.** 
  System natively handles Manual EFT reconciliation. PayPal requires inserting live API keys into Vercel before it can process transactions.

---

## 11. BACKUPS & ROLLBACK

### Backups
- **Status:** 🔴 NOT YET CONFIGURED.
- **Strategy:** Must be configured directly inside your selected PostgreSQL provider dashboard (e.g., Supabase PITR). Ensure daily automated snapshots are active.

### Rollback
- **Application Rollback:** Can be instantly triggered via the Vercel Dashboard ("Instant Rollback"). This reverts the frontend and API code.
- **Database Rollback:** Rolling back application code **DOES NOT** revert database schemas. If a migration destroys data, you must restore the PostgreSQL provider's automated backup snapshot.

---

## 12. FUTURE DEPLOYMENTS

Normal code deployments to production are completely automated via GitHub and Vercel.

**Standard Workflow:**
1. **Developer change:** You edit the source code locally.
2. **Local testing:** You test the application on `http://localhost:3000`.
3. **Database Changes (if any):** You run `npx prisma migrate dev --name <change_description>` to generate a new migration file.
4. **Git commit:** You commit your code and the new migration files.
5. **GitHub push:** You push the `master` branch to GitHub.
6. **Vercel deployment:** Vercel automatically detects the push and starts a build.
7. **Prisma migrate deploy:** Vercel safely runs your new migrations against production.
8. **Production build:** Vercel builds the Next.js app.
9. **Live:** The deployment goes live automatically.

*Always ensure database schema changes are strictly represented by Prisma migrations committed to the repository.*

---

## 13. DISASTER RECOVERY

- **Scenario A: Vercel deployment fails.**
  *Recovery:* Inspect the build logs. The previous deployment remains safely active.
- **Scenario B: Application deploys but database migration fails.**
  *Recovery:* Vercel will halt the build before dropping the old deployment. The app remains stable. Fix the Prisma migration locally and push again.
- **Scenario C: Database becomes unavailable.**
  *Recovery:* The frontend will throw 500 errors. Check the Postgres provider status.
- **Scenario D: Bad application deployment reaches production.**
  *Recovery:* Click "Instant Rollback" in the Vercel dashboard.
- **Scenario E: Database data is accidentally damaged.**
  *Recovery:* Log into the Postgres provider and initiate a Point-In-Time-Recovery (PITR) restoration to a timestamp before the damage occurred.

---

## 13. HOST MIGRATION (PORTABILITY)

If Nani Systems leaves Vercel, the architecture is entirely portable:
- **Application:** Natively compatible with any Node.js container (Docker) running `next start`.
- **Database:** Standard PostgreSQL.
- **State:** Exists entirely in Postgres. No proprietary Vercel-bound databases (like KV or Blob) are utilized.

---

## 14. 🚨 PRODUCTION SAFETY RULES

1. **NEVER** commit secrets.
2. **NEVER** expose `ADMIN_SECRET` or `ADMIN_PASSWORD`.
3. **NEVER** expose `DATABASE_URL`.
4. **NEVER** run `npx prisma db push` against production.
5. **NEVER** run `npx prisma migrate reset` against production.
6. **ALWAYS** know which database your terminal is connected to via `.env`.
7. **ALWAYS** verify backups are active before major releases.

---

## 15. FIRST DEPLOYMENT CHECKLIST

1. [ ] Create/select PostgreSQL provider (e.g., Supabase).
2. [ ] Create an empty production database.
3. [ ] Verify the database is 100% empty/new.
4. [ ] Insert the production `DATABASE_URL` into Vercel Environment Variables.
5. [ ] Configure `ADMIN_SECRET`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_APP_URL` in Vercel.
6. [ ] Connect the GitHub repository to the Vercel project.
7. [ ] Configure production domain and update `NEXT_PUBLIC_APP_URL` to match.
8. [ ] Trigger the Vercel deployment.
9. [ ] Verify the `prisma migrate deploy` step succeeded in the Vercel build logs.
10. [ ] Verify application startup (visit the URL).
11. [ ] Test Account creation at `/register`.
12. [ ] Test Admin login at `/login`.
13. [ ] Create a test quote and verify data arrives in the Admin `/leads` panel.
14. [ ] Confirm PostgreSQL backups are actively running.
15. [ ] Declare Launch.

---

## 16. FINAL INFRASTRUCTURE INVENTORY

| Component | Current/Planned Provider | Status |
| :--- | :--- | :--- |
| **Source Control** | GitHub | ✅ Verified |
| **Application Hosting** | Vercel | ✅ Verified |
| **PostgreSQL** | Selected Provider | 🔴 TBD |
| **Domain** | Current Domain | 🔴 TBD |
| **Email** | SMTP Provider | 🟡 Deferred |
| **Payments** | Manual EFT / PayPal | 🟡 Optional / TBD |
| **Authentication** | Nani Systems Custom JWT | ✅ Verified |
| **Backups** | Provider Dependent | 🔴 NOT CONFIGURED |
