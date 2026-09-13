# Nani Systems V1 — Production Deployment Guide

This document outlines the deployment procedure for Nani Systems V1. 

## 1. Environment Preparation
Ensure the host machine or PaaS provider (e.g., Vercel, Railway, Render, AWS) meets the following requirements:
- Node.js 18.17+ or newer
- Access to a PostgreSQL database

## 2. Environment Variables
Copy .env.example to .env (or configure these variables in your provider's dashboard):
`ash
cp .env.example .env
`
Fill in the production values:
- DATABASE_URL: Production PostgreSQL connection string.
- ADMIN_PASSWORD: A secure password to access the /admin dashboard.
- ADMIN_SECRET: A 32-character crypto secret (generate via \openssl rand -base64 32\).
- NEXT_PUBLIC_APP_URL: The public-facing URL of the deployed application.
- PAYPAL_ENVIRONMENT: Set to \production\.
- PAYPAL_CLIENT_ID & PAYPAL_SECRET: Your live PayPal REST API credentials.

## 3. Install Dependencies
`ash
npm install
`

## 4. Database Migration
Apply the Prisma schema to your production database using deploy (DO NOT use db push in production):
`ash
npx prisma migrate deploy
`

## 5. Build the Application
Generate the optimized production build:
`ash
npm run build
`

## 6. Start the Server
Start the Next.js production server:
`ash
npm run start
`
*(Note: If deploying to Vercel, steps 3-6 are typically handled automatically by the platform's build pipeline).*

## 7. Production Verification Checklist
- [ ] Visit the homepage and verify assets/animations load smoothly.
- [ ] Test the contact form submission.
- [ ] Navigate to /admin and verify that access is blocked without correct credentials.
- [ ] Verify that PayPal is operating in live mode (if ready for commercial processing).
