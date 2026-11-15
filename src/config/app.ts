// Single source of truth for score settings and product limits.
// Values follow docs/02 and docs/03 (revised 15 Nov 2026); tune them here,
// never hard-code them elsewhere.
// Rule: boosts NEVER change scores or organic ranking.

export const scoring = {
  // Guest score and hotel score are each the plain average of their visible
  // ratings (no weighting); they are shown separately.
  ratingScale: { min: 1, max: 5 },

  // Default "Recommended" search ranking (must add up to 1)
  ranking: {
    rating: 0.6, // guest + hotel score combined
    activity: 0.2, // content in the last 90 days
    profileCompleteness: 0.2,
  },
  // Below this many reviews a score does not count towards ranking
  minReviewsForRanking: 3,
  activityWindowDays: 90,
} as const;

export const reviews = {
  // One review per guest email per animator in this window
  cooldownDays: 30,
  bodyMaxLength: 1000,
  // Admin alert when an animator gets this many reviews within the window
  burstAlert: { count: 15, windowHours: 24 },
} as const;

export const limits = {
  hotelDocumentRetentionDays: 30, // delete authorization docs after approval
  boostExpiryReminderDays: 3,
  featuredSlotsPerPage: 3,
} as const;

export const media = {
  photoMaxEdgePx: 1600,
  videoMaxSeconds: 60,
  videoMaxBytes: 50 * 1024 * 1024,
  // Quotas are still open decisions (docs/08)
  freeMediaQuota: null as number | null,
  boostedMediaQuota: null as number | null,
} as const;
