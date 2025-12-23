# EverstoneBTC Deployment Guide

This guide details the steps to deploy the EverstoneBTC application to a production environment (e.g., VPS with Docker).

## Prerequisites
- **Docker** and **Docker Compose** installed.
- **Node.js** (for local development, optional for production).
- **Git** to clone the repository.
- A **Bitcoin Node** (or access to one via RPC) if running a self-hosted full node, or a connection to a BTCPay Server.
- **BTCPay Server** configured for handling payments.

## Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Jdelg718/Everstone-btc.git
   cd Everstone-btc
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory. You can copy the example if one exists.
   ```bash
   # Example .env content
   DATABASE_URL="file:./dev.db" # Or your production DB URL
   NEXT_PUBLIC_BASE_URL="https://everstonebtc.com"
   # ... add other required keys from .env.example
   ```

3. **Build and Run with Docker Compose**
   ```bash
   docker-compose up -d --build --force-recreate
   ```

4. **Run Database Migrations**
   **IMPORTANT:** Because the production Docker image prunes dev dependencies (including the `prisma` CLI), running `npx prisma` will attempt to download the *latest* version. This often causes version mismatches (e.g., Prisma 7.x vs 5.x schema).
   
   **You MUST pin the version to match `package.json` (currently 5.22.0):**

   ```bash
   docker exec -it everstone-app npx prisma@5.22.0 migrate deploy
   ```

5. **Seed the Database**
   The seed script loads initial required data.
   
   ```bash
   docker exec -it everstone-app node prisma/seed.js
   ```

## Troubleshooting

### "The column `isPublic` does not exist"
If you see this error during seeding, it means your migrations did not run correctly, likely due to a Prisma version mismatch. Ensure you ran the migration command with the pinned version (`@5.22.0`) as shown in Step 4.

### "Prisma schema validation error (get-config wasm)"
This occurs if you run `npx prisma migrate deploy` without the version tag, and it defaults to Prisma 7.x+, which has deprecated `url = env()`. Use the pinned `npx prisma@5.22.0` command to fix this.
