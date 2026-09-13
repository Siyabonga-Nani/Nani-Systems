# Nani Systems Local Development Guide

## Prerequisites
- Node.js installed
- PowerShell (used by the launcher)

## Starting the Project Locally (Founder Experience)
To start the project and begin working locally:
1. Double-click the **`START-NANI-SYSTEMS-V1.bat`** file in the root directory.
2. A terminal will open automatically.
3. The local PostgreSQL database will start.
4. The Next.js development server will start on port 3000.
5. Your browser will automatically open to `http://localhost:3000`.

*When you are done, press `Ctrl+C` in the terminal to stop the Next.js server and shut down the local database automatically.*

## Available Commands
If you prefer using the terminal directly, the following commands are available:
- `npm install`: Install project dependencies.
- `npm run dev`: Start the Next.js development server (you will need to start the DB manually).
- `npm run build`: Create a production build locally.
- `npm run lint`: Run ESLint validation.
*(Note: A test runner is not yet configured for Phase 1.)*

## Environment Configuration
The environment configuration is handled in the `.env` file. A template is provided in `.env.example`.
The local development environment defaults to using the portable PostgreSQL database included in the repository. Do NOT commit production secrets to `.env`.

## Database
The application relies on PostgreSQL and Prisma ORM. The local workflow runs a self-contained portable PostgreSQL database to maintain parity with the production architecture without requiring complex system-level installations.
