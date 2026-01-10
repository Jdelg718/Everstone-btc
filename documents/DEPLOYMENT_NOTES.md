# Deployment Notes - Phase 1 Updates

## Database Migration Required

After deploying Phase 1 changes, you **must** run the database migration on your VPS:

```bash
# SSH into your VPS
ssh your-vps

# Navigate to project directory
cd /path/to/everstone

# Run migration
npx prisma migrate deploy
```

This will apply the `add_block_height` migration that adds the `blockHeight` column to the Memorial table.

## Environment Variables

Add these optional environment variables to your VPS `.env` file:

```bash
# Optional: Custom mempool.space API URL (defaults to https://mempool.space/api)
# Only needed if you want to use a custom instance
# MEMPOOL_API_URL="https://mempool.space/api"

# REQUIRED FOR PRODUCTION: Secret token for cron endpoints
# Generate a secure random token
CRON_SECRET="your-secure-random-token-here"
```

### Generating a Secure CRON_SECRET

```bash
# Generate a random 32-character token
openssl rand -base64 32
```

## Cron Job Setup

Set up a cron job to periodically sync block heights (recommended every 10 minutes):

### Option 1: Using cron-job.org (Easiest)
1. Visit https://cron-job.org
2. Create a new cron job
3. Set URL: `https://yourdomain.com/api/cron/sync-block-heights`
4. Add Header: `Authorization: Bearer YOUR_CRON_SECRET`
5. Set schedule: Every 10 minutes
6. Save and enable

### Option 2: Server Crontab
```bash
# Edit crontab
crontab -e

# Add this line (runs every 10 minutes)
*/10 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/sync-block-heights
```

### Option 3: GitHub Actions (if hosted on Vercel/Netlify)
Create `.github/workflows/sync-blocks.yml`:

```yaml
name: Sync Block Heights
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Call sync endpoint
        run: |
          curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
               https://yourdomain.com/api/cron/sync-block-heights
```

## Build Process

No changes needed to the build process. The standard Next.js build works:

```bash
npm run build
npm run start
```

## New Files Added

- `lib/mempool.ts` - Mempool.space API helper
- `app/api/cron/sync-block-heights/route.ts` - Cron endpoint
- `app/explore/MemorialCard.tsx` - Client component for explore page
- `prisma/migrations/20260110192328_add_block_height/` - Database migration

## Modified Files

- `prisma/schema.prisma` - Added blockHeight field
- `app/m/[slug]/MemorialClient.tsx` - Added blockchain verification badge
- `app/explore/page.tsx` - Refactored to use MemorialCard component

## Security Considerations

1. **CRON_SECRET is optional but HIGHLY RECOMMENDED** in production
   - Without it, anyone can trigger the sync endpoint
   - This could lead to rate limiting from mempool.space API
   - Set it in production: `CRON_SECRET="secure-random-token"`

2. **Rate Limiting**
   - The cron endpoint makes one API call per memorial without blockHeight
   - Mempool.space has rate limits (typically generous for free tier)
   - Running every 10 minutes should be well within limits

3. **Database Backup**
   - The migration is non-destructive (only adds a column)
   - Consider backing up your database before running migration anyway

## Testing After Deployment

1. Check migration applied:
```bash
npx prisma studio
# Verify Memorial table has blockHeight column
```

2. Test cron endpoint:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/sync-block-heights
```

Expected response:
```json
{
  "success": true,
  "message": "Synced X of Y memorials",
  "total": Y,
  "synced": X,
  "failed": 0,
  "errors": []
}
```

3. Check explore page:
   - Visit https://yourdomain.com/explore
   - Verify block heights and TX IDs appear on memorial cards
   - Click block height/TX links to verify they go to mempool.space

## Rollback Plan

If issues arise, you can rollback the migration:

```bash
# This will remove the blockHeight column
npx prisma migrate resolve --rolled-back 20260110192328_add_block_height
```

Note: You'll need to manually remove the column if data exists:
```sql
ALTER TABLE Memorial DROP COLUMN blockHeight;
```

## Performance Impact

- **Database**: Minimal - one nullable integer column added
- **API**: One new endpoint that's only called by cron
- **Frontend**: Minimal - small badges added to cards
- **External API Calls**: Only from cron job, not from user requests

## No Breaking Changes

All changes are **backwards compatible**:
- Old memorials without blockHeight will work fine
- The UI gracefully handles missing blockHeight
- Existing APIs and pages unchanged

---

**Ready for Production Deployment! ✅**
