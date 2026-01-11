# MeetAI - AI-Powered Meeting Assistant

## Overview

MeetAI is a comprehensive AI-powered meeting assistant platform built with Next.js 16, TypeScript, and modern web technologies. It enables users to create, manage, and participate in meetings with AI agents that can transcribe, summarize, and analyze conversations in real-time.

## 🚀 Live Demo

https://meetai-kappa-seven.vercel.app/

## ✨ Key Features

### 🤖 AI Agents
- Create custom AI agents with specific instructions and personalities
- Agents can join meetings as participants
- Real-time conversation analysis and response generation
- Powered by OpenAI GPT models and Google Gemini

### 📹 Video & Audio Meetings
- High-quality video calling powered by Stream Video SDK
- Real-time audio transcription and processing
- Screen sharing and collaboration tools
- Multi-participant support with role management

### 📝 Meeting Management
- Schedule and organize meetings with multiple participants
- Real-time meeting status tracking (upcoming, active, completed, processing, cancelled)
- Automatic meeting recording and transcription
- AI-powered meeting summaries and action items

### 👥 User Authentication & Profiles
- Social login (Google, GitHub) and email/password authentication
- User profiles with avatar generation using DiceBear
- Session management and security

### 🏫 Classroom Features
- Create virtual classrooms for educational purposes
- Teacher-student enrollment system
- Scheduled classroom meetings
- Role-based access control

### 💳 Premium Features
- Integration with Polar for subscription management
- Free tier limitations (3 agents, 3 meetings)
- Premium tier with unlimited agents and meetings
- Customer portal for subscription management

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: Next.js App Router with nuqs for query state

### Backend & API
- **API Layer**: tRPC for type-safe API calls
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with schema management
- **Authentication**: Better Auth with social providers
- **File Storage**: Stream for video/chat services

### AI & ML
- **OpenAI**: GPT models for conversation and analysis
- **Google Gemini**: Alternative AI model support
- **Inngest**: Background job processing for AI tasks
- **Real-time Processing**: OpenAI Realtime API integration

### Infrastructure & DevOps
- **Deployment**: Vercel
- **Database**: Neon PostgreSQL
- **Webhooks**: ngrok for local development
- **Package Management**: npm
- **Code Quality**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
meetai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main application pages
│   │   ├── api/               # API routes
│   │   └── call/              # Meeting call interface
│   ├── components/            # Reusable UI components
│   │   └── ui/                # Base UI components (shadcn/ui)
│   ├── modules/               # Feature-based modules
│   │   ├── agents/            # AI agent management
│   │   ├── meetings/          # Meeting functionality
│   │   ├── auth/              # Authentication features
│   │   ├── dashboard/         # Dashboard components
│   │   ├── home/              # Home page
│   │   └── premium/           # Subscription features
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication configuration
│   │   ├── polar.ts           # Payment integration
│   │   └── stream-*.ts        # Stream SDK setup
│   ├── trpc/                  # tRPC configuration
│   ├── db/                    # Database schema and connection
│   ├── inngest/               # Background job functions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── drizzle.config.ts          # Database configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **sessions**: Authentication sessions
- **accounts**: OAuth provider accounts
- **verification**: Email verification and password reset

### Application Tables
- **agents**: AI agent definitions and instructions
- **meetings**: Meeting metadata and status
- **meeting_participants**: Meeting participant relationships
- **classrooms**: Virtual classroom management
- **classroom_enrollments**: Classroom membership
- **classroom_meetings**: Scheduled classroom meetings

### Meeting Status Types
- `upcoming`: Scheduled but not started
- `active`: Currently in progress
- `completed`: Finished and processed
- `processing`: AI analysis in progress
- `cancelled`: Meeting cancelled

## 🔧 Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://meetai-kappa-seven.vercel.app"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream.io (Video & Chat)
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="your-stream-video-key"
STREAM_VIDEO_SECRET_KEY="your-stream-video-secret"
NEXT_PUBLIC_STREAM_CHAT_API_KEY="your-stream-chat-key"
STREAM_CHAT_SECRET_KEY="your-stream-chat-secret"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
# GEMINI_API_KEY="your-gemini-api-key" (optional)

# Payment Processing
POLAR_ACCESS_TOKEN="your-polar-access-token"

# Application
NEXT_PUBLIC_APP_URL="https://meetai-kappa-seven.vercel.app"
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd meetai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `https://meetai-kappa-seven.vercel.app` (for production) or `http://localhost:3000` (for development)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run dev:webhook` - Start ngrok for webhook development

## 🔌 API Architecture

### tRPC Routes
- `agents` - AI agent CRUD operations with pagination
- `meetings` - Meeting management and operations
- `auth` - Authentication endpoints via Better Auth
- `premium` - Subscription management via Polar

### Webhook Endpoints
- `/api/webhook/stream` - Stream.io event handling (call events, transcription, recording)
- `/api/inngest` - Inngest background job processing

### Background Jobs (Inngest)
- **Meeting Processing**: Automatic transcript analysis and summary generation
- **AI Agent Integration**: GPT-4 powered meeting summarization
- **Speaker Identification**: Automatic participant identification and attribution

## 🤖 AI Integration

### OpenAI Integration
- GPT-4 for conversation analysis
- Real-time API for live meeting processing
- Custom prompts for meeting summarization

### Inngest Functions
- Meeting transcript processing
- AI-powered summary generation
- Background job queue management

### Agent System
- Customizable agent personalities and instructions
- Instruction-based behavior using natural language prompts
- Multi-agent meeting participation
- Real-time agent responses during meetings
- Agent meeting history and analytics

## 🎨 UI/UX Features

### Design System
- Responsive design with mobile-first approach
- Dark/light theme support
- Custom Tailwind configuration
- Consistent spacing and typography

### UI Components
- **Design System**: shadcn/ui with New York style
- **Component Library**: 50+ reusable components
- **Icons**: Lucide React icons
- **Form Validation**: React Hook Form with Zod schemas
- **Styling**: Tailwind CSS with custom design tokens

### User Experience
- Real-time updates
- Optimistic UI updates
- Smooth animations and transitions
- Progressive loading

## 🔒 Security Features

- JWT-based authentication
- OAuth 2.0 integration
- CSRF protection
- Input validation and sanitization
- Secure session management
- Environment variable protection

## 📊 Performance Optimizations

- Next.js 16 with Turbopack support (webpack fallback)
- Image optimization and lazy loading
- Code splitting and dynamic imports
- Database query optimization with Drizzle ORM
- Caching strategies with React Query
- Bundle size optimization and tree shaking
- CDN integration via Vercel Edge Network

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - Database URL (Neon PostgreSQL)
   - Authentication secrets (Better Auth)
   - API keys (OpenAI, Stream.io, Polar)
   - OAuth provider credentials
3. Deploy automatically on push to main branch
4. Configure custom domain and SSL certificates

### Environment Configuration
- **Production**: Optimized builds with minification
- **Development**: Hot reload and debugging tools
- **Staging**: Pre-production testing environment

### Manual Deployment
```bash
npm run build
npm run start
```

### Database Management
```bash
# Push schema changes
npm run db:push

# Open database studio
npm run db:studio

# Generate migrations (if needed)
npm run db:generate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments for additional context

## 🔧 Development Tools

### Code Quality
- **ESLint**: Next.js core web vitals and TypeScript rules
- **TypeScript**: Strict mode with comprehensive type checking
- **Prettier**: Code formatting (configured via components.json)
- **Git Hooks**: Pre-commit hooks for code quality

### Build System
- **Webpack**: Primary bundler (Turbopack disabled for compatibility)
- **PostCSS**: Tailwind CSS processing with autoprefixer
- **Asset Optimization**: Automatic image and font optimization

### Development Environment
- **Hot Reload**: Fast refresh during development
- **Environment Variables**: Comprehensive configuration management
- **Database Studio**: Drizzle Studio for database management
- **Webhook Testing**: ngrok integration for local webhook development

## 📈 Analytics & Monitoring

### Application Metrics
- Meeting participation statistics
- Agent usage analytics
- User engagement tracking
- Performance monitoring via Vercel Analytics

### Error Handling
- Comprehensive error boundaries
- Graceful degradation for AI service failures
- User-friendly error messages with Sonner toasts
- Logging and debugging tools

## 🌐 Internationalization

### Multi-language Support
- Urdu language support for local users
- RTL (Right-to-Left) text support
- Localized date and time formatting
- Cultural UI adaptations

## 🔮 Future Roadmap

- [ ] Advanced AI agent capabilities
- [ ] More integrations (Zoom, Teams, Calendar)
- [ ] Advanced analytics and insights
- [ ] Mobile applications
- [ ] Enterprise features
- [ ] Advanced classroom tools
- [ ] Real-time collaboration features
- [ ] Custom branding options
- [ ] API for third-party integrations

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
