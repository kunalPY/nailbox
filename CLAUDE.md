# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# IMPORTANT

- Always prioritize writing clean, simple, and modular code.
- Use simple & easy-to-understand language. Write in short sentences.
- DO NOT BE LAZY! Always read files IN FULL!!

# COMMENTS  
- Write lots of comments in your code. explain exactly what you are doing in your comments.  
- but be strategic, do not explain obvious syntax – instead explain your thought process at the time of writing the code!  
- NEVER delete explanatory comments from the code you're editing (unless they are wrong/obsolete)  
- focus on explaining the non-obvious stuff in the comments, the nuances / details  
- DO NOT delete comments currently in our code. If the comment is obsolete, or wrong, then update it – but NEVER mindlessly remove comments without reason.


## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 3001 with turbo mode (filters out HTTP request logs)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Database Commands
- `npm run db:generate` - Generate Prisma migrations for development
- `npm run db:migrate` - Deploy migrations to production database
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:studio` - Open Prisma Studio for database management

## Architecture Overview

This is a Next.js 14 email client application with AI capabilities, built with:

### Frontend Stack
- **Next.js 14** with App Router for the framework
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with shadcn/ui components
- **tRPC** for type-safe API calls between frontend and backend
- **React Query** (@tanstack/react-query) for data fetching and caching
- **Clerk** for authentication and user management

### Backend Architecture
- **API Routes** in `src/app/api/` handling:
  - Aurinko integration for email sync (`aurinko/callback`, `aurinko/webhook`)
  - Stripe integration for payments (`stripe/checkout`, `stripe/webhook`)
  - AI completions via OpenAI SDK (`chat`, `completion`)
  - tRPC endpoint (`trpc/[trpc]`)
- **tRPC Server** in `src/server/` with routers for mail, search, and webhooks
- **Prisma ORM** with PostgreSQL for data persistence
- **Email Integration** via Aurinko API (supports Google and Office365)

### Key Features
- **Email Management**: Full email client with inbox, threading, search
- **AI Integration**: Email composition assistance, smart replies, and chat functionality
- **Search**: Powered by Orama for fast, client-side search with persistence
- **Subscription System**: Stripe integration with free/pro tiers controlling account limits
- **Real-time Updates**: Webhook support for email sync and payment events

### Important Constants
- Free users: 1 email account limit (`FREE_ACCOUNTS_PER_USER`)
- Pro users: 10 email accounts limit (`PRO_ACCOUNTS_PER_USER`)

### Environment Configuration
The app requires extensive environment variables for:
- Clerk authentication
- Database connection (Prisma)
- Aurinko email integration
- Stripe payments
- OpenAI API
- Application URLs

### Project Structure
- `/src/app/` - Next.js app router pages and API routes
- `/src/components/` - Reusable React components and UI library
- `/src/server/` - Backend logic including tRPC routers and database
- `/src/lib/` - Utility functions and integrations (Aurinko, Stripe, etc.)
- `/src/hooks/` - Custom React hooks
- `/prisma/` - Database schema and migrations