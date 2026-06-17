# Frontend — CampusToursLive.ai

React + TypeScript single-page application for the CampusToursLive.ai platform.

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite 5** — build tool and dev server (port 5173)
- **React Router 6** — client-side routing
- **TanStack Query 5** — server state and data fetching
- **Tailwind CSS 3** + **shadcn-ui** — styling and base UI components
- **Ant Design 5** — additional form and layout components
- **Ant Media WebRTC Adaptor** — live video streaming
- **React Hook Form** + **Zod** — form management and validation
- **Recharts** — data visualization

## Project Structure

```
src/
├── main.tsx                   # React entry point
├── App.tsx                    # Router setup and root layout
├── pages/                     # One file per route
├── components/
│   ├── ui/                    # shadcn-ui base components (30+)
│   └── *.tsx                  # Feature-specific components
├── hooks/                     # Custom React hooks
└── lib/
    └── utils.ts               # Shared utility functions
```

## Pages & Features

### Home — `/`

Landing page showing featured live campus tours from universities (Stanford, MIT, Harvard, etc.). Includes tour search, geographic filtering by country/state, and tour cards displaying guide info, duration, and pricing.

### Live Tour Viewer — `/tour/:tourId`

Watch a guide's live campus tour stream in real time.

- Live video playback with toggle controls for video and audio
- Real-time group chat with all participants
- Live transcript display
- Participant list and raise-hand Q&A feature
- Reactions and share functionality

### Live Stream Publisher — `/antmedia`

WebRTC-based streaming page used by tour guides to broadcast.

- Local camera/mic preview
- Start/stop stream controls
- Data channel for sending chat messages during the stream
- Connects to an Ant Media Server via WebSocket (`VITE_ANT_WS`)

### Tour Guide Profile — `/guide/:guideId`

Detailed guide page with bio, university affiliation, major, year, languages, specializations, ratings, reviews, and upcoming bookable tours.

### User Dashboard — `/dashboard`

Role-aware dashboard adapting its view based on user type (prospective student, guide, parent, or business owner). Shows available tours, stats, and university-specific details.

### University Integration — `/university-integration`

Browse on-campus job and internship opportunities: research assistant positions, campus tour guide employment, dining services, library assistant roles, and internships — filterable by department and job type.

### Housing Tours — `/housing-tours`

Off-campus housing directory with listings (apartments, co-ops, condos), rent pricing, amenities, and the ability to book a virtual or in-person housing tour.

### Local Businesses — `/local-businesses`

Directory of nearby businesses (cafes, bookstores, restaurants, gyms, tech repair). Shows hiring status, available job positions, pay ranges, hours, and contact info.

### Marketplace Browse — `/listings`

Browse all student marketplace listings across five categories:

- **Housing** — apartments, shared rooms, houses, dorms, studios
- **Jobs** — part-time, full-time, internships, campus jobs, remote
- **Goods** — for sale, free, trade, rental items
- **Activities** — events, study groups, clubs, sports
- **Tutoring** — individual, group, online, exam prep, assignment help

Supports search and multi-category filtering.

### Create Listing — `/create-listing`

Post a new marketplace listing with a category-aware form. Tutoring listings include a specialized tutor profile creation flow. Provides toast feedback on submission.

### My Listings — `/listing-dashboard`

Manage and view all listings posted by the current user.

### Campus Listing Marketplace — `/listingmarketplace`

Hub view aggregating all marketplace listings and featured items across categories.

### Sign Up — `/SignUp`

New user registration form (email, password with visibility toggle, terms checkbox, newsletter option) built with Ant Design Form.

### Demo Pages — `/demo`, `/demoGuide`

Standalone demo experiences for visitors and guides respectively, usable without a full account.

### 404 — `/*`

Not Found page for unmatched routes.

## Key Hooks & Components

### `useAuth` — Authentication

Context-based auth with `signIn()`, `signUp()`, and `signOut()`. Session persisted in `localStorage` under the key `campus-tours-user`.

User types: `prospective`, `guide`, `parent`, `business`

User shape: `{ id, name, email, userType, university?, businessName?, businessType? }`

### `useChat` — WebRTC Chat

Manages a WebRTC data channel for real-time messaging during live tours. Handles send/receive and filters system messages from chat messages.

### `AuthDialog` / `TourBookingDialog` / `EnhancedTourBookingDialog`

Shared modal components for authentication flow and tour booking.

## Environment Variables

Create a `.env` file in this directory:

```env
# Ant Media Server WebSocket endpoint
VITE_ANT_WS=ws://your-antmedia-server/WebRTCAppEE/websocket

# Default stream ID for the WebRTC publisher
VITE_DEFAULT_STREAM_ID=demo123
```

## Scripts

```bash
npm install        # install all dependencies
npm run dev        # Start Vite dev server on http://localhost:5173
npm run build      # Production build → dist/
npm run build:dev  # Development build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```
