# What2Watch - Senior Project Presentation Answers

This document provides comprehensive answers to the presentation questions based on the actual implementation of the What2Watch movie recommendation web application.

## UI Domain Answers (Frontend & User Experience)

### 1. Component Architecture
**Answer:** The application uses a modular component architecture with clear separation of concerns:

- **UI Components (`/components/ui/`)**: Reusable base components built on Radix UI primitives (Button, Card, Dialog, etc.)
- **Feature Components (`/components/`)**: Application-specific components like `navbar.tsx`, `movie-card.tsx`, `auth-provider.tsx`
- **Page Components (`/app/`)**: Next.js 13+ app router structure with route-based organization

Benefits include:
- **Reusability**: UI components can be used across different pages
- **Consistency**: Standardized design system through shared components
- **Maintainability**: Changes to base components propagate throughout the app
- **Type Safety**: Full TypeScript integration with component props

### 2. Responsive Design Implementation
**Answer:** The application implements a mobile-first responsive design with adaptive navigation:

**Mobile Navigation (Bottom):**
```tsx
<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
  <div className="flex justify-around items-center h-16">
    {navItems.map((item) => (
      <Link href={item.path} className="flex flex-col items-center justify-center w-full h-full">
        {item.icon}
        <span className="text-xs mt-1">{item.name}</span>
      </Link>
    ))}
  </div>
</div>
```

**Desktop Navigation (Top):**
```tsx
<header className="hidden md:flex md:justify-center fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
```

**Strategy Benefits:**
- Bottom navigation improves mobile thumb accessibility
- Desktop header provides traditional navigation experience
- Conditional rendering (`md:hidden` / `hidden md:flex`) optimizes performance

### 3. Design System & Styling
**Answer:** The design system combines Tailwind CSS with Radix UI for a cohesive experience:

**Tailwind Configuration:**
- Custom color palette with CSS variables for theming
- Responsive breakpoints and spacing system
- Utility-first approach for rapid development

**Radix UI Integration:**
- Accessible components (Dialog, DropdownMenu, Accordion)
- Consistent interaction patterns
- Built-in keyboard navigation and screen reader support

**Utility Function (`lib/utils.ts`):**
```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
This enables conditional classes and resolves Tailwind conflicts.

### 4. State Management
**Answer:** The application uses React's built-in state management with strategic patterns:

**Local State with useState:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [recommendations, setRecommendations] = useState<MoviePoster[]>([]);
```

**Session State with NextAuth:**
```tsx
const { data: session, status } = useSession();
```

**Chat History State:**
```tsx
const [chatHistory, setChatHistory] = useState<Message[]>([{
  id: "welcome-message",
  content: "Hello! I am your movie recommendation assistant...",
  role: "assistant",
  timestamp: new Date(),
}]);
```

**Key Patterns:**
- Optimistic updates for better UX
- Loading states for async operations
- Form state management with controlled components

### 5. User Authentication Flow
**Answer:** The authentication flow provides a seamless user experience:

**Login Process:**
1. User enters credentials in `/login` page
2. Form validation prevents invalid submissions
3. NextAuth handles credential verification
4. Successful login redirects to intended page
5. Session persists across browser refreshes

**UI Features:**
- Form validation with error messages
- Loading states during authentication
- Automatic redirects for protected routes
- Conditional navigation based on auth status

**Protected Route Handling:**
```tsx
{status === "authenticated" ? (
  <Button asChild className="bg-gradient-to-r from-purple-600 to-cyan-600">
    <Link href="/profile">
      <User className="h-5 w-5 mr-2" /> My Profile
    </Link>
  </Button>
) : (
  <Button asChild variant="ghost">
    <Link href="/login">
      <LogIn className="h-5 w-5 mr-2" /> Login
    </Link>
  </Button>
)}
```

### 6. Movie Card Component
**Answer:** The `movie-card.tsx` component handles diverse data sources efficiently:

**Data Source Flexibility:**
- Accepts both Prisma Movie objects and external movie_posters data
- Handles missing poster images with fallbacks
- Supports different card layouts (grid vs. list)

**Optimization Techniques:**
- Lazy loading for images
- Responsive image sizing
- Hover effects for better interactivity
- Action buttons (Add to Watchlist, Like)

**Error Handling:**
- Graceful fallbacks for missing data
- Loading states for async actions
- Toast notifications for user feedback

### 7. Search & Filter Interface
**Answer:** The search functionality provides comprehensive filtering options:

**Real-time Search Implementation:**
```tsx
const handleSearch = async () => {
  if (!searchQuery.trim()) return;
  setIsLoading(true);
  
  try {
    const dbResponse = await fetch(`/api/movie-posters?query=${encodeURIComponent(searchQuery)}`);
    const dbData = await dbResponse.json();
    
    if (dbData.success && dbData.movies.length > 0) {
      setRecommendations(dbData.movies);
    }
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    setIsLoading(false);
  }
};
```

**Filter Features:**
- Genre-based filtering
- Year range selection
- Title-based search
- Combined search criteria

### 8. Chat Interface Design
**Answer:** The AI chat interface prioritizes user experience and functionality:

**Message Display:**
```tsx
<div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
    <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-600 to-cyan-600">
      <div className="text-white text-xs font-bold">
        {message.role === "user" ? "ME" : "AI"}
      </div>
    </Avatar>
    <div className={`rounded-lg px-4 py-2 text-sm ${message.role === "user" 
      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
      : "bg-gray-100 text-gray-800"
    }`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </div>
  </div>
</div>
```

**Design Features:**
- Distinct styling for user vs. AI messages
- Markdown rendering for rich content
- Auto-scroll to latest messages
- Loading indicators during AI responses

### 9. Form Validation & Error Handling
**Answer:** Form validation ensures data integrity and user guidance:

**Client-side Validation:**
- Required field validation
- Email format validation
- Password strength requirements
- Real-time feedback

**Error Display:**
```tsx
{error && (
  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
    {error}
  </div>
)}
```

**Toast Notifications:**
- Success confirmations
- Error messages
- Loading states
- Action feedback

### 10. Accessibility Considerations
**Answer:** The application implements comprehensive accessibility features:

**Keyboard Navigation:**
- Tab order optimization
- Focus management
- Keyboard shortcuts (Ctrl+B for sidebar)

**Screen Reader Support:**
```tsx
<span className="sr-only">Toggle Sidebar</span>
```

**Semantic HTML:**
- Proper heading hierarchy
- ARIA labels and roles
- Form labels and descriptions
- Navigation landmarks

**Visual Accessibility:**
- High contrast color schemes
- Focus indicators
- Responsive text sizing
- Color-independent information

### 11. Loading States & User Feedback
**Answer:** The application provides comprehensive user feedback:

**Loading Spinners:**
```tsx
{isLoading ? (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
  </div>
) : (
  // Content
)}
```

**Skeleton Components:**
- Used in UI library for placeholder content
- Maintains layout during loading
- Provides visual feedback

**Toast Notifications:**
- Success/error confirmations
- Action feedback
- Non-blocking notifications

### 12. Progressive Enhancement
**Answer:** The application ensures functionality across different capabilities:

**JavaScript Degradation:**
- Server-side rendering with Next.js
- Form submissions work without JavaScript
- Basic navigation remains functional

**Network Resilience:**
- Error boundaries for component failures
- Retry mechanisms for failed requests
- Offline-capable basic functionality

## Backend Domain Answers (API & Server Logic)

### 1. API Route Architecture
**Answer:** The Next.js API routes follow RESTful conventions with clear organization:

**Structure:**
```
/app/api/
  ├── auth/[...nextauth]/route.ts    # Authentication handler
  ├── register/route.ts              # User registration
  ├── movies/route.ts                # Movie search/retrieval
  ├── movie-posters/route.ts         # External movie data
  └── user/                          # User-specific operations
      ├── add-to-watchlist/route.ts
      ├── like-movie/route.ts
      ├── watchlist/route.ts
      └── liked-movies/route.ts
```

**Conventions:**
- HTTP methods correspond to CRUD operations
- Consistent response formats
- Proper status codes
- Error handling middleware

### 2. Authentication System
**Answer:** NextAuth.js provides secure, flexible authentication:

**Configuration (`lib/auth.ts`):**
```tsx
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.password
        );
        
        if (!isPasswordValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  }
};
```

**Security Features:**
- Password hashing with bcrypt
- JWT session management
- Secure cookie configuration
- CSRF protection

### 3. Middleware Implementation
**Answer:** Route protection middleware ensures authorized access:

**Implementation (`middleware.ts`):**
```tsx
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/recommendations/:path*",
    "/settings/:path*"
  ]
};
```

**Features:**
- Automatic redirects to login
- Token validation
- Route-specific protection
- Session persistence

### 4. User Registration Process
**Answer:** The registration endpoint ensures secure user creation:

**Validation & Security:**
```tsx
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }
    
    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" }, 
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json(
      { message: "User created successfully" }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

### 5. Movie Data Management
**Answer:** The dual endpoint approach handles different data sources efficiently:

**Movies API (`/api/movies/route.ts`):**
- Handles Prisma-managed Movie records
- User-specific operations (watchlist, likes)
- Relational data queries

**Movie Posters API (`/api/movie-posters/route.ts`):**
- Raw SQL queries for external data
- Large dataset operations
- Search functionality across all movies

**Coordination:**
```tsx
// Create Movie record when user interacts
const movie = await prisma.movie.create({
  data: {
    title: movieData.title,
    year: movieData.year,
    genres: movieData.genres,
    // ... other fields
  }
});
```

### 6. Watchlist & Likes API
**Answer:** User-movie relationships are managed through Prisma's many-to-many relations:

**Add to Watchlist:**
```tsx
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    watchlist: {
      connect: { id: movieId }
    }
  }
});
```

**Database Relations:**
- `watchlist Movie[] @relation("UserWatchlist")`
- `likedMovies Movie[] @relation("UserLikedMovies")`
- `watchedMovies Movie[] @relation("UserWatchedMovies")`

**Features:**
- Atomic operations
- Duplicate prevention
- Efficient queries with includes

### 7. Search API Optimization
**Answer:** Search implementation uses optimized database queries:

**Full-text Search:**
```sql
SELECT * FROM movie_posters 
WHERE title ILIKE $1 
   OR ARRAY_TO_STRING(genres, ', ') ILIKE $1
ORDER BY 
  CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
  title
LIMIT $2
```

**Optimizations:**
- ILIKE for case-insensitive search
- Array-to-string conversion for genre search
- Result ranking by relevance
- Pagination with LIMIT/OFFSET

### 8. Error Handling Strategy
**Answer:** Comprehensive error handling ensures reliable API responses:

**Standardized Error Format:**
```tsx
try {
  // Operation
} catch (error) {
  console.error("Operation failed:", error);
  return NextResponse.json(
    { 
      success: false, 
      error: "Operation failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, 
    { status: 500 }
  );
}
```

**Error Types:**
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### 9. Session Management
**Answer:** Session handling ensures secure user operations:

**Session Retrieval:**
```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);

if (!session?.user) {
  return NextResponse.json(
    { error: "Unauthorized" }, 
    { status: 401 }
  );
}
```

**Security Considerations:**
- Server-side session validation
- Token expiration handling
- Cross-site request protection

### 10. Raw SQL vs ORM
**Answer:** The hybrid approach optimizes for different use cases:

**Raw SQL for movie_posters:**
- Large dataset queries
- Complex search operations
- Performance optimization
- External data integration

**Prisma ORM for application data:**
- Type safety
- Relationship management
- Development productivity
- Migration management

**Trade-offs:**
- Complexity: Managing two data access patterns
- Performance: Raw SQL for heavy queries, ORM for relationships
- Maintenance: Prisma migrations vs. manual schema management

### 11. API Response Standardization
**Answer:** Consistent response formats improve client integration:

**Success Response:**
```tsx
return NextResponse.json({
  success: true,
  data: results,
  message: "Operation completed"
});
```

**Error Response:**
```tsx
return NextResponse.json({
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}, { status: 400 });
```

**Benefits:**
- Predictable client-side handling
- Easier debugging
- Consistent error messaging

### 12. Rate Limiting & Security
**Answer:** Security measures protect against abuse and attacks:

**Input Validation:**
- Parameter sanitization
- SQL injection prevention
- XSS protection

**Authentication:**
- JWT token validation
- Session verification
- Route protection

**Headers:**
- CORS configuration
- Security headers
- Content type validation

## Database Domain Answers (Data Management & Architecture)

### 1. Database Schema Design
**Answer:** The Prisma schema implements efficient many-to-many relationships:

**User Model:**
```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  watchlist     Movie[]   @relation("UserWatchlist")
  likedMovies   Movie[]   @relation("UserLikedMovies")
  watchedMovies Movie[]   @relation("UserWatchedMovies")
}
```

**Movie Model:**
```prisma
model Movie {
  id             String    @id @default(uuid())
  title          String
  year           Int
  director       String?
  plot           String?   @db.Text
  posterUrl      String?
  backdropUrl    String?
  rating         Float?
  runtime        Int?      // in minutes
  genres         String[]
  cast           String[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // Relations with users
  inWatchlist    User[]    @relation("UserWatchlist")
  likedBy        User[]    @relation("UserLikedMovies")
  watchedBy      User[]    @relation("UserWatchedMovies")
}
```

**Design Benefits:**
- UUID primary keys for scalability
- Named relations prevent conflicts
- Array types for flexible data (genres, cast)
- Timestamp tracking with automatic updates

### 2. Dual Database Approach
**Answer:** The architecture separates concerns between user data and movie catalog:

**Prisma-managed Tables:**
- User authentication and profiles
- User-movie relationships (watchlist, likes)
- Application-specific data

**External movie_posters Table:**
- Large movie catalog (potentially millions of records)
- External data source integration
- Read-heavy operations

**Challenges & Solutions:**
- Data consistency: Synchronization when creating Movie records
- Query complexity: Joining Prisma and raw SQL results
- Schema evolution: Managing both Prisma migrations and external schema

### 3. PostgreSQL Integration
**Answer:** PostgreSQL provides advanced features for the movie application:

**Advantages:**
- Array data types for genres and cast
- Full-text search capabilities
- JSONB for flexible metadata
- Strong ACID compliance
- Excellent performance with large datasets

**Prisma Integration:**
```tsx
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4. Data Migration Strategy
**Answer:** Prisma migrations provide version-controlled schema evolution:

**Migration Process:**
1. Schema changes in `schema.prisma`
2. Generate migration: `npx prisma migrate dev`
3. Review generated SQL
4. Apply to database
5. Update Prisma client

**Production Strategy:**
```bash
# Generate migration
npx prisma migrate dev --name add_movie_features

# Deploy to production
npx prisma migrate deploy
```

**Benefits:**
- Version control for schema changes
- Rollback capabilities
- Team collaboration
- Environment consistency

### 5. Movie Data Synchronization
**Answer:** Synchronization ensures data consistency between sources:

**Trigger Points:**
- User adds movie to watchlist
- User likes a movie
- User marks movie as watched

**Synchronization Logic:**
```tsx
// Check if Movie exists in Prisma
let movie = await prisma.movie.findFirst({
  where: { 
    title: movieData.title,
    year: movieData.year 
  }
});

// Create if doesn't exist
if (!movie) {
  movie = await prisma.movie.create({
    data: {
      title: movieData.title,
      year: movieData.year,
      genres: movieData.genres,
      // ... other fields from movie_posters
    }
  });
}

// Add to user's watchlist
await prisma.user.update({
  where: { id: userId },
  data: {
    watchlist: {
      connect: { id: movie.id }
    }
  }
});
```

### 6. Query Optimization
**Answer:** Database queries are optimized for performance:

**Prisma Optimizations:**
```tsx
// Include relations efficiently
const userWithMovies = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    watchlist: {
      select: {
        id: true,
        title: true,
        year: true,
        genres: true
      }
    }
  }
});
```

**Raw SQL Optimizations:**
```sql
-- Indexed search with ranking
SELECT * FROM movie_posters 
WHERE title ILIKE $1 
ORDER BY 
  CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
  popularity DESC
LIMIT 20;
```

**Performance Strategies:**
- Selective field inclusion
- Pagination for large datasets
- Database indexing
- Query result caching

### 7. Relationship Management
**Answer:** Prisma's relation system simplifies complex associations:

**Many-to-Many Relations:**
```tsx
// Add multiple movies to watchlist
await prisma.user.update({
  where: { id: userId },
  data: {
    watchlist: {
      connect: [
        { id: movie1Id },
        { id: movie2Id }
      ]
    }
  }
});

// Remove from watchlist
await prisma.user.update({
  where: { id: userId },
  data: {
    watchlist: {
      disconnect: { id: movieId }
    }
  }
});
```

**Benefits:**
- Automatic junction table management
- Type-safe operations
- Cascade delete handling
- Efficient batch operations

### 8. Data Types & Validation
**Answer:** Strategic data type choices ensure data integrity:

**Array Types:**
```prisma
genres  String[]  // PostgreSQL array for multiple genres
cast    String[]  // Actor names array
```

**Text Types:**
```prisma
plot    String?   @db.Text  // Long text for movie descriptions
```

**Validation Benefits:**
- Prisma generates TypeScript types
- Runtime validation
- Database constraints
- Client-side type safety

### 9. Backup & Recovery
**Answer:** Data protection strategy ensures business continuity:

**Backup Strategy:**
- Automated daily PostgreSQL backups
- Point-in-time recovery capability
- Separate backup storage
- Regular restore testing

**Transaction Management:**
```tsx
await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { /* user updates */ }
  }),
  prisma.movie.create({
    data: { /* movie data */ }
  })
]);
```

### 10. Indexing Strategy
**Answer:** Database indexes optimize query performance:

**Prisma Indexes:**
```prisma
model User {
  email  String  @unique  // Automatic index
  @@index([createdAt])    // Custom index
}

model Movie {
  title  String
  year   Int
  @@index([title, year])  // Composite index
  @@index([genres])       // Array index
}
```

**Performance Impact:**
- Fast user lookups by email
- Efficient movie search by title/year
- Genre filtering optimization

### 11. Prisma Client Configuration
**Answer:** Optimized client configuration prevents connection issues:

**Connection Management:**
```tsx
// lib/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Benefits:**
- Singleton pattern prevents multiple instances
- Development query logging
- Production optimization
- Connection pooling

### 12. Data Seeding
**Answer:** Database seeding provides initial data for development:

**Seed Script Strategy:**
```tsx
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("password", 12)
      }
    })
  ]);

  // Create sample movies
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: "Inception",
        year: 2010,
        genres: ["Sci-Fi", "Thriller"]
      }
    })
  ]);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## AI Domain Answers (Machine Learning & Recommendations)

### 1. AI Architecture Overview
**Answer:** The dual AI system provides flexibility and reliability:

**OpenAI Integration:**
- Structured movie recommendations
- High-quality responses
- Reliable API availability
- Advanced reasoning capabilities

**Ollama Local LLM:**
- Chat interface functionality
- Privacy-focused processing
- Offline capability
- Cost-effective for chat

**Benefits:**
- Fallback redundancy
- Cost optimization
- Privacy compliance
- Feature specialization

### 2. OpenAI Integration
**Answer:** OpenAI provides structured movie recommendations through the AI SDK:

**Implementation (`lib/ai-recommendations.ts`):**
```tsx
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getMovieRecommendations(query: string) {
  try {
    const prompt = `
      Based on the user's query: "${query}", provide 6 movie recommendations.
      Return the response as a valid JSON array of movie objects with the following structure:
      [
        {
          "id": number,
          "title": string,
          "year": number,
          "poster": string,
          "genres": string[],
          "reason": string
        }
      ]
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      system: "You are a knowledgeable film expert with deep understanding of cinema across all genres, eras, and countries."
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return []
  }
}
```

**Features:**
- Structured JSON responses
- Temperature control for creativity
- System prompts for consistency
- Error handling with fallbacks

### 3. Local LLM with Ollama
**Answer:** Ollama integration provides privacy-focused chat functionality:

**Chat Implementation:**
```tsx
const handleChatSubmit = async () => {
  try {
    const systemPrompt = "You are a movie expert. You can only talk about films, directors, actors, film genres, movie recommendations, and general cinema knowledge.";

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: `${systemPrompt}\n\nUser: ${currentMessage}`,
        stream: false,
      }),
    });

    const data = await response.json();
    
    const assistantMessage = {
      id: Date.now().toString(),
      content: data.response || "Sorry, I couldn't generate a recommendation.",
      role: "assistant",
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, assistantMessage]);
  } catch (error) {
    console.error("Chat response error:", error);
    // Handle Ollama unavailable
  }
};
```

**Fallback Handling:**
- Detect Ollama unavailability
- Graceful error messages
- Alternative recommendation sources

### 4. Prompt Engineering
**Answer:** Carefully crafted prompts ensure relevant, structured responses:

**System Prompts:**
```tsx
const systemPrompt = "You are a knowledgeable film expert with deep understanding of cinema across all genres, eras, and countries. Provide thoughtful, personalized movie recommendations based on user preferences.";
```

**Structured Prompts:**
```tsx
const prompt = `
Based on the user's query: "${query}", provide 6 movie recommendations.
Return the response as a valid JSON array of movie objects with the following structure:
[
  {
    "id": number,
    "title": string,
    "year": number,
    "poster": string (use "/placeholder.svg?height=450&width=300" for now),
    "genres": string[],
    "reason": string (brief explanation of why this movie is recommended based on the query)
  }
]
`;
```

**Techniques:**
- Domain restriction (movies only)
- Output format specification
- Example-driven prompts
- Temperature tuning for creativity

### 5. RAG System Implementation
**Answer:** The system combines retrieval and generation for comprehensive recommendations:

**Retrieval Process:**
```tsx
// First, search database for relevant movies
const dbResponse = await fetch(`/api/movie-posters?query=${encodeURIComponent(searchQuery)}`);
const dbData = await dbResponse.json();

if (dbData.success && dbData.movies.length > 0) {
  // Use database results
  setRecommendations(dbData.movies);
} else {
  // Fall back to AI generation
  const aiRecommendations = await getMovieRecommendations(searchQuery);
  setRecommendations(aiRecommendations);
}
```

**Decision Logic:**
- Database search for exact matches
- AI generation for creative recommendations
- Hybrid results for comprehensive coverage

### 6. Chat Interface Logic
**Answer:** The conversation system maintains context and integrates with search:

**Context Management:**
```tsx
const [chatHistory, setChatHistory] = useState<Message[]>([{
  id: "welcome-message",
  content: "Hello! I am your movie recommendation assistant...",
  role: "assistant",
  timestamp: new Date(),
}]);
```

**Integration with Search:**
```tsx
// If chat mentions movies, trigger search
if (currentMessage.toLowerCase().includes("film") ||
    currentMessage.toLowerCase().includes("movie") ||
    currentMessage.toLowerCase().includes("recommend")) {
  setSearchQuery(currentMessage);
  handleSearch();
}
```

**Features:**
- Persistent conversation history
- Auto-scroll to latest messages
- Integration with movie search
- Loading states for responses

### 7. AI Response Processing
**Answer:** Response validation ensures reliable data handling:

**JSON Parsing with Validation:**
```tsx
try {
  const recommendations = JSON.parse(text);
  
  // Validate structure
  if (Array.isArray(recommendations)) {
    const validMovies = recommendations.filter(movie => 
      movie.title && movie.year && movie.genres
    );
    return validMovies;
  }
} catch (error) {
  console.error("Failed to parse AI response:", error);
  return [];
}
```

**Error Handling:**
- Malformed JSON recovery
- Missing field validation
- Fallback to default values
- User-friendly error messages

### 8. Recommendation Algorithm
**Answer:** The recommendation system combines multiple signals:

**Input Sources:**
- User search queries
- Chat conversation context
- User's watchlist and liked movies
- Database movie catalog

**Algorithm Logic:**
1. Parse user intent from query/chat
2. Search database for exact matches
3. Generate AI recommendations for novel suggestions
4. Combine and rank results
5. Present personalized recommendations

**Personalization:**
```tsx
// Consider user's previous likes
const userContext = session?.user ? {
  watchlist: userWatchlist,
  likedMovies: userLikes,
  preferences: derivedPreferences
} : null;
```

### 9. Performance Optimization
**Answer:** AI integrations are optimized for speed and reliability:

**Caching Strategy:**
- Cache AI responses for common queries
- Store successful recommendations
- Reduce API calls

**Async Processing:**
```tsx
// Non-blocking AI calls
const handleSearch = async () => {
  setIsLoading(true);
  
  try {
    // Quick database search first
    const dbResults = await fetchFromDatabase(query);
    if (dbResults.length > 0) {
      setRecommendations(dbResults);
      setIsLoading(false);
    }
    
    // AI enhancement in background
    const aiResults = await getAIRecommendations(query);
    if (aiResults.length > 0) {
      setRecommendations(prev => [...prev, ...aiResults]);
    }
  } finally {
    setIsLoading(false);
  }
};
```

**Rate Limiting:**
- Debounced search inputs
- Request queuing
- Error retry logic

### 10. Error Handling in AI
**Answer:** Comprehensive error handling ensures application stability:

**API Failure Handling:**
```tsx
try {
  const response = await fetch("http://localhost:11434/api/generate", {
    // ... request config
  });
  
  if (!response.ok) {
    throw new Error("Model did not respond");
  }
} catch (error) {
  console.error("Chat response error:", error);
  
  const errorMessage = {
    id: Date.now().toString(),
    content: "Sorry, there was an error. Please ensure Ollama is running.",
    role: "assistant",
    timestamp: new Date(),
  };
  
  setChatHistory(prev => [...prev, errorMessage]);
}
```

**Fallback Mechanisms:**
- Default recommendations
- Error message display
- Alternative AI providers
- Database-only mode

### 11. Data Privacy & AI
**Answer:** Privacy protection measures safeguard user data:

**Data Minimization:**
- Send only necessary context to AI services
- Avoid sending personal user information
- Use anonymized queries when possible

**Local Processing:**
- Ollama runs locally for sensitive conversations
- User data stays on-device when possible
- Encrypted connections for external APIs

**Privacy Controls:**
```tsx
// Strip personal information before AI calls
const sanitizedQuery = query.replace(/personal_info_pattern/g, '[REDACTED]');

const recommendations = await getMovieRecommendations(sanitizedQuery);
```

### 12. Future AI Enhancements
**Answer:** Planned improvements would enhance recommendation quality:

**Advanced Personalization:**
- User preference learning from interactions
- Collaborative filtering based on similar users
- Temporal preference tracking

**Enhanced AI Features:**
- Multi-modal recommendations (text + images)
- Sentiment analysis of user reviews
- Real-time trending movie integration

**Technical Improvements:**
- Vector embeddings for semantic search
- Fine-tuned models for movie domain
- Edge AI deployment for faster responses

## Cross-Domain Integration Answers

### 1. Full-Stack Data Flow
**Answer:** Complete user action flow demonstrates system integration:

**Adding Movie to Watchlist Flow:**

1. **UI Interaction:** User clicks "Add to Watchlist" on movie card
2. **Client State:** Button shows loading state, optimistic UI update
3. **API Request:** POST to `/api/user/add-to-watchlist`
4. **Authentication:** Middleware validates session
5. **Database Operations:**
   - Check if Movie exists in Prisma
   - Create Movie if needed from movie_posters data
   - Update User's watchlist relation
6. **Response:** Success/error returned to client
7. **UI Update:** Toast notification, button state change
8. **State Sync:** Watchlist state updated across components

**Code Flow:**
```tsx
// UI Component
const handleAddToWatchlist = async () => {
  setIsLoading(true);
  
  try {
    const response = await fetch('/api/user/add-to-watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, movieData })
    });
    
    if (response.ok) {
      toast.success("Added to watchlist!");
      setIsInWatchlist(true);
    }
  } catch (error) {
    toast.error("Failed to add to watchlist");
  } finally {
    setIsLoading(false);
  }
};

// API Handler
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { movieId, movieData } = await request.json();
  
  // Ensure Movie exists
  let movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    movie = await prisma.movie.create({ data: movieData });
  }
  
  // Add to watchlist
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      watchlist: { connect: { id: movie.id } }
    }
  });
  
  return NextResponse.json({ success: true });
}
```

### 2. Technology Stack Justification
**Answer:** Each technology choice serves specific project requirements:

**Next.js 15:**
- **Benefits:** App Router for modern routing, Server Components for performance, API routes for backend, excellent TypeScript support
- **Why:** Full-stack framework reduces complexity, great developer experience, production-ready

**React 19:**
- **Benefits:** Latest features, improved server components, better concurrent rendering
- **Why:** Cutting-edge UI capabilities, large ecosystem, team familiarity

**Prisma ORM:**
- **Benefits:** Type-safe database access, automatic migrations, excellent PostgreSQL support
- **Why:** Reduces SQL boilerplate, prevents runtime errors, great developer experience

**PostgreSQL:**
- **Benefits:** Advanced data types (arrays, JSONB), full-text search, excellent performance
- **Why:** Movie data requires arrays for genres/cast, reliable for production

**Tailwind CSS + Radix UI:**
- **Benefits:** Utility-first styling, accessible components, consistent design system
- **Why:** Rapid development, accessibility out-of-box, maintainable styles

**OpenAI + Ollama:**
- **Benefits:** High-quality AI responses, local privacy, cost-effective hybrid approach
- **Why:** Best of both worlds - cloud AI quality with local privacy options

### 3. Scalability Considerations
**Answer:** Architecture decisions support growth across multiple dimensions:

**Database Scalability:**
- **Current:** PostgreSQL with proper indexing and query optimization
- **Scaling:** Read replicas for movie data, connection pooling, query caching
- **Future:** Database sharding by user regions, separate movie catalog service

**API Scalability:**
- **Current:** Next.js API routes with efficient queries
- **Scaling:** API route caching, rate limiting, CDN for static assets
- **Future:** Microservices architecture, dedicated movie service

**AI Scalability:**
- **Current:** Direct API calls to OpenAI/Ollama
- **Scaling:** Response caching, request batching, rate limiting
- **Future:** AI response caching layer, multiple AI provider load balancing

**Frontend Scalability:**
- **Current:** Client-side state management, component modularity
- **Scaling:** Code splitting, lazy loading, service workers
- **Future:** Micro-frontend architecture for different features

**Potential Bottlenecks:**
1. **Database:** Large movie catalog queries
2. **AI APIs:** Rate limits and response times
3. **Authentication:** Session validation overhead
4. **Search:** Full-text search performance

### 4. Security Implementation
**Answer:** Multi-layered security protects user data and system integrity:

**Authentication Security:**
- **JWT Tokens:** Secure session management with NextAuth
- **Password Hashing:** bcrypt with salt rounds for secure storage
- **Session Validation:** Server-side session verification on protected routes

**API Security:**
```tsx
// Input validation
const { movieId } = await request.json();
if (!movieId || typeof movieId !== 'string') {
  return NextResponse.json({ error: "Invalid input" }, { status: 400 });
}

// Authorization check
const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Database Security:**
- **Parameterized Queries:** Prevents SQL injection
- **Prisma ORM:** Built-in SQL injection protection
- **Access Control:** User-specific data isolation

**Frontend Security:**
- **XSS Prevention:** React's built-in escaping, content sanitization
- **CSRF Protection:** NextAuth CSRF tokens
- **Input Validation:** Client and server-side validation

**Infrastructure Security:**
- **Environment Variables:** Secure credential storage
- **HTTPS:** Encrypted data transmission
- **Security Headers:** Content Security Policy, HSTS

### 5. Performance Optimization
**Answer:** Optimization techniques improve user experience across the stack:

**Frontend Performance:**
```tsx
// Image optimization
<Image 
  src={movie.posterUrl || '/placeholder.svg'} 
  alt={movie.title}
  width={300} 
  height={450}
  loading="lazy"
  placeholder="blur"
/>

// Component lazy loading
const ChatInterface = lazy(() => import('./ChatInterface'));

// Debounced search
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);
```

**Backend Performance:**
```tsx
// Efficient database queries
const userWithMovies = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    watchlist: {
      select: {
        id: true,
        title: true,
        year: true,
        posterUrl: true
      }
    }
  }
});

// Response caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

**Database Performance:**
```sql
-- Optimized search query
SELECT * FROM movie_posters 
WHERE title ILIKE $1 
ORDER BY 
  CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
  popularity DESC
LIMIT 20;

-- Efficient indexing
CREATE INDEX idx_movie_title_year ON movies(title, year);
CREATE INDEX idx_movie_genres ON movies USING GIN(genres);
```

**AI Performance:**
- **Request Caching:** Cache common recommendation queries
- **Batch Processing:** Group similar requests
- **Fallback Strategies:** Quick database results while AI processes

**Bundle Optimization:**
- **Code Splitting:** Route-based chunks
- **Tree Shaking:** Remove unused code
- **Dynamic Imports:** Load features on demand

---

*These answers demonstrate comprehensive understanding of the What2Watch application architecture, implementation details, and technical decisions across all domains.*
