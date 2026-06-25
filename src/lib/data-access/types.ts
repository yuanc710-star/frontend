/** Shared domain types for the data-access layer. */

export type Role = "PARTICIPANT" | "GUIDE" | "ADMIN" | "SUPPORT";

export interface Me {
  id: string;
  roles: Role[];
  activeRole: Role | null;
  participantType: string | null;
  guideStatus: string | null;
  accountStatus: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string | null;
  ageBand: string | null;
  createdAt: string | null; // ISO-8601 (UTC) account creation; rendered as "Member since <Month Year>"
}

export interface ParticipantProfile {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  participantType?: string;
  gradeLevel?: string;
  intendedMajor?: string;
  topicsOfInterest?: string[];
  universitiesOfInterest?: string[];
  guardianRequired?: boolean;
}

export interface GuideProfile {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  applicationStatus?: string;
  major?: string;
  classYear?: string;
}

/** A guide's sellable tour offering (Core TourOfferingResponse). */
export interface Offering {
  id: string;
  title: string;
  slug: string;
  status: string;
  topic: string | null;
  universityId: string | null;
  durationMin: number;
  priceCents: number;
  currency: string;
  description?: string | null;
}

/** Body for POST /v1/guide/offerings — creates a DRAFT offering. */
export interface CreateOfferingInput {
  title: string;
  universityId: string;
  topic: string;
  durationMin: number;
  priceCents: number;
  description?: string;
  languages?: string[];
}

/** GET /v1/dashboard — the role-shaped home aggregate (discriminated by `kind`). */
export interface GuideDashboard {
  kind: "guide";
  guide: GuideProfile;
  guideStatus: string | null;
  canPublish: boolean;
  offerings: Offering[];
  createdAt: string | null; // account "member since" (ISO-8601, from MeResponse.createdAt)
}
export interface ParticipantDashboard {
  kind: "participant";
  participant: ParticipantProfile;
  nextTour?: BookingDetail | null;
  upcomingBookings?: BookingDetail[];
  pendingActions?: PendingActions;
  recommendedOfferings?: RecommendedOffering[];
  createdAt: string | null;
}
export type BookingStatus =
  | "PENDING_PAYMENT"
  | "WAITING_FOR_GUIDE"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingDetail {
  id: string;
  status: BookingStatus;
  scheduledAt: string; // ISO-8601 UTC
  timezone: string; // e.g. "America/Los_Angeles"
  offeringId: string;
  offeringTitle: string;
  offeringImageUrl?: string | null;
  guideName: string;
  guideResponseDeadline?: string | null; // ISO-8601，Guide 需在此时前回应
  universityName: string;
  durationMin: number;
  priceCents: number;
  currency: string;
}

export interface PendingActions {
  paymentsToFinish: number;
  waitingForGuide: number;
  reviewsToWrite: number;
}

export interface RecommendedOffering {
  id: string;
  title: string;
  imageUrl?: string | null;
  isVerifiedGuide: boolean;
  durationMin: number;
  priceCents: number;
  currency: string;
  universityName: string;
}
export type Dashboard = GuideDashboard | ParticipantDashboard;

/** GET /v1/onboarding?role= — derived onboarding progress. */
export interface OnboardingStep {
  key: string;
  label: string;
  done: boolean;
}
export interface OnboardingProgress {
  role: "guide" | "participant";
  started: boolean;
  complete: boolean;
  canSubmit: boolean;
  applicationStatus: string | null;
  verificationStatus: string | null;
  steps: OnboardingStep[];
}

export interface ParticipantProfileUpdate {
  firstName?: string;
  lastName?: string;
  participantType?: string;
  universitiesOfInterest?: string[];
  topicsOfInterest?: string[];
}

export interface GuideProfileUpdate {
  firstName?: string;
  lastName?: string;
  universityId?: string;
  major?: string;
  classYear?: string;
  bio?: string;
  languages?: string[];
  specialties?: string[];
  basePriceCents?: number;
  verificationEmail?: string;
  submit?: boolean;
}

export interface University {
  id: string;
  name: string;
  shortName?: string | null;
  city?: string | null;
  region?: string | null;
}

export interface TourTopic {
  value: string;
  label: string;
}
