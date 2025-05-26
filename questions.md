# What2Watch - Senior Project Presentation Questions

This document contains comprehensive questions for the What2Watch movie recommendation web application presentation. The questions are organized by domain and based on the actual codebase implementation.

## UI Domain Questions (Frontend & User Experience)

1. **Component Architecture**: Explain the component structure of your React application. How did you organize the UI components using the `/components/ui/` directory pattern, and what benefits does this modular approach provide?

2. **Responsive Design Implementation**: Walk us through your mobile-first responsive design strategy. How did you implement the dual navigation system (bottom navigation for mobile, top navigation for desktop) in the `navbar.tsx` component?

3. **Design System & Styling**: Describe your use of Tailwind CSS and the Radix UI component library. How do you maintain consistent theming across the application, and what role does the `lib/utils.ts` file play in your styling approach?

4. **State Management**: Explain how you handle client-side state management in your React components. Show examples from your movie browsing, search functionality, and chat interface implementations.

5. **User Authentication Flow**: Walk through the complete user authentication experience from the UI perspective. How do you handle login/signup forms, session management, and protected route redirections?

6. **Movie Card Component**: Analyze your `movie-card.tsx` component. How does it handle different data sources (Prisma movies vs. movie_posters table) and what optimization techniques did you implement for image loading?

7. **Search & Filter Interface**: Demonstrate the search functionality in your movies page. How do you implement real-time search, genre filtering, and year range filtering in the user interface?

8. **Chat Interface Design**: Explain the design decisions behind your AI chat interface in the recommendations page. How do you handle message display, loading states, and markdown rendering for AI responses?

9. **Form Validation & Error Handling**: Show how you implement form validation in your signup/login forms and how you display error messages to users throughout the application.

10. **Accessibility Considerations**: What accessibility features have you implemented? Discuss keyboard navigation, screen reader support, and semantic HTML usage in your components.

11. **Loading States & User Feedback**: How do you provide visual feedback to users during asynchronous operations? Show examples of loading spinners, skeleton components, and toast notifications.

12. **Progressive Enhancement**: Explain how your application works for users with JavaScript disabled and how you ensure graceful degradation of features.

## Backend Domain Questions (API & Server Logic)

1. **API Route Architecture**: Explain your Next.js API route structure under `/app/api/`. How did you organize endpoints for authentication, movies, and user management, and what conventions did you follow?

2. **Authentication System**: Walk through your NextAuth.js implementation in `lib/auth.ts`. How do you handle credential-based authentication, JWT tokens, and session management on the server side?

3. **Middleware Implementation**: Explain your route protection middleware in `middleware.ts`. How does it determine which routes require authentication and how does it handle redirections?

4. **User Registration Process**: Analyze the `/api/register/route.ts` endpoint. How do you validate user input, hash passwords with bcrypt, and handle duplicate email scenarios?

5. **Movie Data Management**: Describe how your `/api/movies/route.ts` and `/api/movie-posters/route.ts` endpoints work together. Why did you choose to have separate endpoints for different data sources?

6. **Watchlist & Likes API**: Explain the implementation of user watchlist and movie liking functionality. How do you handle the relationship between users and movies in your API endpoints?

7. **Search API Optimization**: Discuss your search implementation in the movies API. How do you handle different search types (title vs. all fields) and what database query optimizations did you implement?

8. **Error Handling Strategy**: Show how you implement comprehensive error handling across your API routes. How do you ensure consistent error responses and proper HTTP status codes?

9. **Session Management**: Explain how you retrieve and validate user sessions across different API endpoints using `getServerSession()`. What security considerations did you implement?

10. **Raw SQL vs ORM**: Justify your decision to use raw SQL queries for the `movie_posters` table while using Prisma ORM for other operations. What are the trade-offs of this hybrid approach?

11. **API Response Standardization**: How do you ensure consistent API response formats across all endpoints? Show examples of your success/error response patterns.

12. **Rate Limiting & Security**: What security measures have you implemented in your API routes to prevent abuse, SQL injection, and unauthorized access?

## Database Domain Questions (Data Management & Architecture)

1. **Database Schema Design**: Explain your Prisma schema design in `prisma/schema.prisma`. How did you model the relationships between Users and Movies using many-to-many relations for watchlist, liked movies, and watched movies?

2. **Dual Database Approach**: Justify your architecture decision to use both Prisma-managed tables and an external `movie_posters` table. What challenges does this create and how do you manage data consistency?

3. **PostgreSQL Integration**: Describe your PostgreSQL database setup and how Prisma generates the database client. What advantages does PostgreSQL provide for your movie recommendation application?

4. **Data Migration Strategy**: Walk through your database migration process using Prisma. How do you handle schema changes and what is your strategy for production database updates?

5. **Movie Data Synchronization**: Explain how you handle the synchronization between the `Movie` table (Prisma) and the `movie_posters` table. When and why do you create new records in the Movie table?

6. **Query Optimization**: Analyze your database queries, particularly the raw SQL queries for the movie_posters table. How do you optimize for performance with large datasets and complex searches?

7. **Relationship Management**: Demonstrate how you handle user-movie relationships (watchlist, likes, watched). How does Prisma's relation system simplify these complex many-to-many relationships?

8. **Data Types & Validation**: Explain your choice of data types for different fields (e.g., genres as String[], poster images as Buffer). How does Prisma help with type safety and validation?

9. **Backup & Recovery**: What is your strategy for database backup and recovery? How do you handle data integrity and transaction management?

10. **Indexing Strategy**: What database indexes have you implemented to optimize query performance, especially for search operations across movie titles, genres, and user relationships?

11. **Prisma Client Configuration**: Explain your Prisma client setup in `lib/prisma.ts`. How do you handle connection pooling and prevent connection limit issues in development vs. production?

12. **Data Seeding**: Describe your database seeding strategy. How do you populate initial data and what challenges did you face with the external movie_posters table integration?

## AI Domain Questions (Machine Learning & Recommendations)

1. **AI Architecture Overview**: Explain your dual AI approach using both OpenAI's GPT-4 and local Ollama models. What are the advantages and trade-offs of this hybrid system?

2. **OpenAI Integration**: Walk through your OpenAI implementation in `lib/ai-recommendations.ts`. How do you use the AI SDK to generate structured movie recommendations and what prompt engineering techniques did you employ?

3. **Local LLM with Ollama**: Demonstrate your Ollama integration for the chat interface. How do you handle local model communication and what happens when the local model is unavailable?

4. **Prompt Engineering**: Analyze your prompt design for movie recommendations. How do you ensure the AI provides relevant, structured responses and stays within the movie domain?

5. **RAG System Implementation**: Explain how your system combines retrieval from your movie database with AI generation. How do you decide when to use database search vs. AI recommendations?

6. **Chat Interface Logic**: Describe the conversation flow in your AI chat system. How do you maintain context, handle streaming responses, and integrate chat responses with movie search results?

7. **AI Response Processing**: Show how you parse and validate AI responses, particularly the JSON structure for movie recommendations. How do you handle malformed or unexpected AI outputs?

8. **Recommendation Algorithm**: Explain your recommendation logic. How do you combine user preferences, AI suggestions, and database search results to provide personalized recommendations?

9. **Performance Optimization**: Discuss the performance implications of your AI integrations. How do you handle API rate limits, response times, and fallback mechanisms?

10. **Error Handling in AI**: How do you handle AI service failures, network issues, and malformed responses? What fallback mechanisms ensure the application remains functional?

11. **Data Privacy & AI**: What measures have you taken to protect user data when sending requests to external AI services? How do you handle sensitive user information?

12. **Future AI Enhancements**: What improvements would you make to your AI system? Consider features like user preference learning, collaborative filtering, or advanced recommendation engines.

## Cross-Domain Integration Questions

1. **Full-Stack Data Flow**: Trace a complete user action (e.g., adding a movie to watchlist) from UI interaction through API processing to database storage and back to UI update.

2. **Technology Stack Justification**: Defend your choice of Next.js 15, React 19, Prisma, PostgreSQL, and your AI integrations. How do these technologies work together effectively?

3. **Scalability Considerations**: How would your application handle increased user load, larger movie databases, and higher AI API usage? What bottlenecks might you encounter?

4. **Security Implementation**: Discuss your end-to-end security approach covering authentication, authorization, data validation, and protection against common web vulnerabilities.

5. **Performance Optimization**: What optimization techniques have you implemented across the stack? Consider bundle optimization, database query performance, and AI response caching.

---

*This question set is designed to comprehensively evaluate understanding of the What2Watch application across all technical domains. Each question is based on actual implementation details found in the codebase.*
