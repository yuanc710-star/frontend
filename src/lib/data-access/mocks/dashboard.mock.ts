import type {
  ParticipantDashboard,
  BookingDetail,
  PendingActions,
  RecommendedOffering,
} from "../types";

//Mock Bookings（对应设计图里的真实数据）

export const MOCK_NEXT_TOUR: BookingDetail = {
  id: "booking-001",
  status: "CONFIRMED",
  scheduledAt: "", // 填一个距现在约 2 小时后的 ISO 字符串，e.g. new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  timezone: "America/Los_Angeles",
  offeringId: "offering-001",
  offeringTitle: "Campus life and hidden study spots",
  offeringImageUrl: null,
  guideName: "Maya Chen",
  guideResponseDeadline: null,
  universityName: "North Coast University",
  durationMin: 60,
  priceCents: 3200,
  currency: "USD",
};

//upcomingBookings — 两条，状态不同：

export const MOCK_UPCOMING_BOOKINGS: BookingDetail[] = [
  {
    id: "booking-002",
    status: "WAITING_FOR_GUIDE",
    scheduledAt: "2026-06-27T20:30:00.000Z",
    timezone: "America/Los_Angeles",
    offeringId: "offering-002",
    offeringTitle: "International student experience",
    offeringImageUrl: null,
    guideName: "Alex Kim",
    universityName: "Harborview University",
    durationMin: 75,
    priceCents: 4500,
    currency: "USD",
  },
  {
    id: "booking-003",
    status: "CONFIRMED",
    scheduledAt: "2026-07-02T23:00:00.000Z",
    timezone: "America/Los_Angeles",
    offeringId: "offering-003",
    offeringTitle: "Engineering, labs, and student projects",
    offeringImageUrl: null,
    guideName: "Jordan Lee",
    guideResponseDeadline: null,
    universityName: "Redwood State College",
    durationMin: 90,
    priceCents: 5000,
    currency: "USD",
  },
];

export const MOCK_PENDING_ACTIONS: PendingActions = {
  paymentsToFinish: 0,
  waitingForGuide: 1,
  reviewsToWrite: 1,
};

export const MOCK_RECOMMENDED_OFFERINGS: RecommendedOffering[] = [
  {
    id: "offering-004",
    title: "CS & Engineering at North Coast",
    imageUrl: null,
    isVerifiedGuide: true,
    durationMin: 45,
    priceCents: 3200,
    currency: "USD",
    universityName: "North Coast University",
  },
  {
    id: "offering-005",
    title: "Housing and first-year life",
    imageUrl: null,
    isVerifiedGuide: true,
    durationMin: 60,
    priceCents: 4000,
    currency: "USD",
    universityName: "North Coast University",
  },
];

export const MOCK_PARTICIPANT_DASHBOARD: ParticipantDashboard = {
  kind: "participant",
  participant: {
    firstName: "Jordan",
    lastName: "Smith",
    displayName: "Jordan",
    participantType: "STUDENT",
  },
  nextTour: MOCK_NEXT_TOUR,
  upcomingBookings: MOCK_UPCOMING_BOOKINGS,
  pendingActions: MOCK_PENDING_ACTIONS,
  recommendedOfferings: MOCK_RECOMMENDED_OFFERINGS,
  createdAt: "2025-09-01T00:00:00.000Z",
};
