// Single source of truth for score weights and product limits.
// Values are starting suggestions from docs/03 and docs/02; tune them here,
// never hard-code them elsewhere.
// Rule: boosts NEVER change scores or organic ranking.

export const scoring = {
  // Bayesian average: score = (C·m + Σ wᵢ·rᵢ) / (C + Σ wᵢ)
  bayesianPrior: 5, // C

  // Guest review weight by verification level
  reviewWeights: {
    full: 1.0, // animator QR + hotel-confirmed active employment
    partial: 0.6, // animator QR, no active employment
    none: 0.25, // unverified
  },

  hotelReviewWeight: 1.0,

  // Default "Recommended" search ranking (must add up to 1)
  ranking: {
    weightedScore: 0.6,
    activity: 0.2, // content in the last 90 days, request response speed
    profileCompleteness: 0.2,
  },
  activityWindowDays: 90,
} as const;

export const limits = {
  contactRequestsPerDay: 10, // free accounts
  contactRequestExpiryDays: 14,
  guestReviewCooldownDays: 30, // one review per account per animator
  qrTokenTtlSeconds: 60,
  hotelDocumentRetentionDays: 30, // delete authorization docs after approval
  boostExpiryReminderDays: 3,
  featuredSlotsPerPage: 3,
} as const;

export const media = {
  photoMaxEdgePx: 1600,
  videoMaxSeconds: 60,
  videoMaxBytes: 50 * 1024 * 1024,
  // Quotas are still open decisions (docs/05)
  freeMediaQuota: null as number | null,
  boostedMediaQuota: null as number | null,
} as const;
