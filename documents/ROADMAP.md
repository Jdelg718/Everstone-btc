# Everstone Development Roadmap

> **Last Updated:** January 10, 2026
> **Status:** Phase 1 Complete ✅ | Phase 2 Ready to Begin

---

## Table of Contents
1. [Feature Roadmap](#feature-roadmap)
2. [Beautification Improvements](#beautification-improvements)
3. [Marketing Strategy](#marketing-strategy)
4. [Technical Debt](#technical-debt)

---

## Feature Roadmap

### Phase 1: Block Height & Transaction Display ✅ COMPLETED
**Priority:** High | **Complexity:** Low | **Completed:** January 10, 2026

Display Bitcoin block height and transaction link on memorial pages and explore page after confirmation.

#### Tasks
- [x] Add `blockHeight` field to Memorial schema
- [x] Create `lib/mempool.ts` helper for mempool.space API
- [x] Update `MemorialClient.tsx` to fetch and display block info
- [x] Add abbreviated TX link (e.g., `abc12...f89`) with tooltip
- [x] Style the blockchain verification badge
- [x] Create optional cron endpoint to sync block heights
- [x] Add block height & TX display to explore page cards

#### Implementation Details
- **Database**: Added nullable `blockHeight` integer field to Memorial model
- **API Helper**: Created `lib/mempool.ts` with functions to query mempool.space API
- **Memorial Page**: Displays verification badge with clickable block height and TX links
- **Explore Page**: Shows block height and TX ID overlaid on memorial card images
- **Cron Endpoint**: `/api/cron/sync-block-heights` automatically syncs block heights
- **Security**: Optional `CRON_SECRET` environment variable for production

#### Deployment Requirements
See `documents/DEPLOYMENT_NOTES.md` for full deployment checklist:
- Run database migration: `npx prisma migrate deploy`
- Set `CRON_SECRET` environment variable (recommended)
- Configure cron job to call sync endpoint every 10 minutes

#### UI Implementation
```
Memorial Page:
┌─ Blockchain Verification ─────────────────────┐
│  🔗 Block #170  •  TX: f4184fc5...e9e16 ↗     │
│  Verified on Bitcoin blockchain               │
└────────────────────────────────────────────────┘

Explore Page:
[Memorial Card with image overlay showing]:
🔗 Block #170
TX: f4184fc5...e9e16
```

---

### Phase 2: Public Explorer API
**Priority:** Medium | **Complexity:** Medium | **Est. Time:** 2-3 days

Create a public API for third-party sites to display and link to Everstone memorials.

#### Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/memorials` | GET | List public memorials (paginated) |
| `/api/v1/memorials/{slug}` | GET | Get single memorial |
| `/api/v1/memorials/by-txid/{txid}` | GET | Lookup by transaction ID |

#### Tasks
- [ ] Create `/api/v1/memorials/route.ts` (list endpoint)
- [ ] Create `/api/v1/memorials/[slug]/route.ts` (detail endpoint)
- [ ] Create `/api/v1/memorials/by-txid/[txid]/route.ts`
- [ ] Add rate limiting headers
- [ ] Write API documentation page
- [ ] Add CORS headers for third-party access

---

### Phase 3: Encrypted Private Messages (Wills)
**Priority:** Medium | **Complexity:** High | **Est. Time:** 5-7 days

Create encrypted messages anchored to Bitcoin with two-key security for legacy/will use cases.

#### Encryption Flow
```
User → Create Message → Encrypt with AES-256
                      → Split key into 2 shares
                      → Share A → Data Bundle (Attorney)
                      → Share B → Derived from TXID (Beneficiaries)
                      → Anchor hash to Bitcoin
```

#### Tasks
- [ ] Add `PrivateMessage` model to Prisma schema
- [ ] Create `lib/encryption.ts` with AES-256-GCM
- [ ] Build `/messages` landing page
- [ ] Build `/messages/create` wizard (3 steps)
- [ ] Build `/messages/view/[txid]` decryption page
- [ ] Create API routes for message CRUD
- [ ] Design printable "key card" for beneficiaries
- [ ] Add email notifications for message creation

---

## Beautification Improvements

### High Priority

#### 1. Loading States & Skeleton Screens
- [ ] Add skeleton loaders for memorial cards on Explore page
- [ ] Add pulsating placeholder while images load
- [ ] Improve loading spinner with branded animation

#### 2. Micro-Animations
- [ ] Add subtle hover effects on memorial cards (scale + shadow)
- [ ] Add smooth page transitions using Framer Motion
- [ ] Animate the "Anchored" badge with a gentle glow pulse
- [ ] Add typewriter effect for epitaph quotes

#### 3. Typography Refinements
- [ ] Use `Playfair Display` for serif headings (more elegant)
- [ ] Increase line-height on bio text for readability
- [ ] Add proper typographic hierarchy (consistent h1-h6)

### Medium Priority

#### 4. Dark Mode Polish
- [ ] Soften the pure black backgrounds to `#0a0a0a`
- [ ] Add subtle grain texture overlay for depth
- [ ] Improve contrast on muted text elements

#### 5. Mobile Experience
- [ ] Optimize memorial cards for single-column mobile view
- [ ] Add swipe gestures for gallery images
- [ ] Improve touch target sizes for buttons
- [ ] Add bottom navigation bar for mobile

#### 6. Gallery Enhancements
- [ ] Add lightbox modal for full-screen image viewing
- [ ] Support image captions
- [ ] Add lazy loading for gallery images
- [ ] Consider masonry layout for varied image sizes

### Lower Priority

#### 7. Footer Redesign
- [ ] Add newsletter signup form
- [ ] Add social media links
- [ ] Add "Powered by Bitcoin" badge with animation
- [ ] Add sitemap links

#### 8. 404 & Error Pages
- [ ] Design custom 404 page with memorial search
- [ ] Design friendly error states with recovery options

---

## Marketing Strategy

### Brand Positioning
> "Everstone: Immortalize memories on the Bitcoin blockchain. Forever immutable. Forever accessible."

### Key Selling Points
1. **Permanence** — Anchored to Bitcoin, the most secure network on Earth
2. **Independence** — No reliance on company servers; offline viewer available
3. **Verification** — Cryptographically provable authenticity
4. **Privacy** — Encrypted messages for sensitive legacy content

---

### Website Copy Improvements

#### Homepage Hero
**Current:** Generic "Create a Memorial"  
**Suggested:**
> "Some memories deserve to last forever.  
> Anchor your loved one's legacy to the Bitcoin blockchain—  
> beyond servers, beyond time."

#### How It Works Page
Add trust-building elements:
- [ ] Add Bitcoin block visualization animation
- [ ] Show real example of OP_RETURN data
- [ ] Add "What if Everstone disappears?" FAQ section
- [ ] Include link to download offline viewer

---

### Content Marketing Ideas

#### Blog Posts to Create
1. "Why Bitcoin is the Ultimate Time Capsule"
2. "How to Create a Digital Legacy Your Grandchildren Can Verify"
3. "The Technology Behind Everstone: OP_RETURN Explained"
4. "5 Reasons to Choose Blockchain Memorials Over Traditional Websites"

#### Social Media Strategy
- **Twitter/X:** Share verified memorials (with permission), engage with Bitcoin community
- **Reddit:** Post in r/Bitcoin, r/CryptoCurrency, r/estate_planning
- **LinkedIn:** Target estate attorneys and funeral directors
- **YouTube:** Demo videos showing the verification process

---

### Partnership Opportunities

| Partner Type | Value Proposition |
|--------------|-------------------|
| Funeral Homes | White-label offering, referral fees |
| Estate Attorneys | Encrypted wills feature, client retention |
| Memorial Websites | API integration, data permanence |
| Bitcoin Conferences | Sponsorship, demo booth |

---

### Pricing Strategy Suggestions

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $100 | Single memorial, 5 images, standard anchoring |
| **Legacy** | $250 | Memorial + encrypted message, priority anchoring |
| **Family** | $500 | Up to 5 memorials, family tree linking (future) |

---

## Technical Debt

### Code Quality
- [ ] Add TypeScript strict mode
- [ ] Create shared UI component library
- [ ] Add input validation with Zod
- [ ] Implement proper error boundaries

### Testing
- [ ] Set up Jest/Vitest for unit tests
- [ ] Add Playwright for E2E testing
- [ ] Create test fixtures for memorials

### DevOps
- [ ] Add staging environment
- [ ] Set up error monitoring (Sentry)
- [ ] Add performance monitoring
- [ ] Create backup strategy for SQLite database

---

## Implementation Schedule

| Week | Focus | Deliverables | Status |
|------|-------|--------------|--------|
| 1 | Block Height Display | Feature complete, deployed | ✅ Complete |
| 2 | Public API | Endpoints live, docs published | 🔜 Next |
| 3-4 | Encrypted Messages | Core encryption, create flow | 📋 Planned |
| 5 | Encrypted Messages | View/decrypt flow, polish | 📋 Planned |
| 6 | Beautification | Animations, mobile, gallery | 📋 Planned |
| Ongoing | Marketing | Content, partnerships | 📋 Planned |

---

## Notes & Decisions

### Open Questions
1. **Block height caching:** Store in DB after confirmation (recommended)
2. **API rate limits:** 100/min public, 1000/min with key
3. **Message storage:** Server-side for MVP, IPFS optional later
4. **"Not before" date:** Nice-to-have, defer to Phase 2

### Changelog
- **2026-01-10:** Initial roadmap created
