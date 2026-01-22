# AccessiBooks

## Overview

AccessiBooks is an audiobook player application focused on accessibility. It offers a library management system to browse audiobooks from multiple sources and an audio player with advanced controls, bookmarking, and accessibility features like high contrast mode, dyslexia-friendly fonts, and keyboard navigation. The platform aggregates content from various external APIs to provide access to a wide range of audiobooks and ebooks. The project aims to provide an inclusive and rich audiobook experience, with market potential in the growing audiobook consumption demographic, especially among users requiring enhanced accessibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript.
- **Styling**: Tailwind CSS with shadcn/ui.
- **State Management**: React hooks for local state, TanStack Query for server state and caching.
- **Build Tool**: Vite.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful endpoints for book management and audio streaming.
- **Middleware**: Express middleware for CORS, JSON parsing, and request logging.

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations.
- **Schema**: `Books` table for metadata.
- **Local Storage**: Browser localStorage for user preferences, bookmarks, and playback progress.
- **In-Memory Storage**: Fallback with sample data for development.

### Authentication and Authorization
- **System**: Passport.js supporting Google, Facebook, Microsoft OAuth, and local email/password.
- **Session Management**: PostgreSQL-backed sessions (30-day duration, rolling expiry).
- **Security**: sameSite cookies, httpOnly, secure in production, bcrypt password hashing.

### Accessibility Features
- **Visual**: High contrast mode, dyslexia-friendly fonts, dark mode.
- **Navigation**: Comprehensive keyboard shortcuts and screen reader support (semantic HTML, ARIA labels).
- **Responsiveness**: Mobile-friendly interface.

### Audio Player System
- **Engine**: HTML5 audio with custom React hooks.
- **Features**: Variable speed, skip, progress tracking, bookmarking, sleep timer, chapter navigation.
- **Persistence**: Automatic playback position saving (local storage + database).

### Personalization Features
- "Continue Listening" section for in-progress books.
- "For You" recommendations based on listening history.
- Genre browsing and listening history tracking.

### Monetization System
- **Subscription Tiers**: Free (ad-supported) and Premium (ad-free, unlimited features).
- **DRM and Content Protection**: Auth-gated streaming, signed URLs (15 min), rate limiting, premium content gating, session enforcement.
- **Spotify-like Controls**: Skip limits, audio quality tiers, shuffle mode limitations, device limits, session-based playback, interstitial ads for free users.
- **Advertising**: Integration with Google AdSense and Google Ad Manager for ad placements, with automatic exclusion for premium users.

## External Dependencies

- **Database**:
    - `@neondatabase/serverless`: Neon Database serverless driver.
    - `drizzle-orm`: Type-safe ORM for PostgreSQL.
- **Data Fetching & Caching**:
    - `@tanstack/react-query`: For server state management.
- **UI & Styling**:
    - `@radix-ui/react-*`: Accessible UI primitives.
    - `tailwindcss`: Utility-first CSS framework.
- **Validation**:
    - `zod`: Schema validation.
- **Payment Gateways**:
    - **Stripe**: For subscription management and one-time donations.
    - **PayPal**: Alternative payment method for subscriptions and donations.
    - **Coinbase Commerce**: For cryptocurrency payments (Bitcoin, Ethereum, USDC, etc.).
- **Content APIs**:
    - **iTunes Search API**: Commercial audiobooks.
    - **LibriVox API**: Free public domain audiobooks.
    - **Open Library API**: Comprehensive book metadata.
    - **Google Books API**: Enhanced search and discovery.
- **Advertising Platforms**:
    - **Google AdSense**: Simple ad integration.
    - **Google Ad Manager (DFP)**: Advanced ad serving.