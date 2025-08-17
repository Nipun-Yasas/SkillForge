# SkillForge Forum System

A complete forum discussion system for the SkillForge platform with real-time functionality, authentication, and comprehensive CRUD operations.

## Features

### 🔐 Authentication & Authorization
- User authentication required for posting threads and replies
- JWT-based session management
- Role-based permissions (learner, mentor, both)

### 📝 Thread Management
- **Create threads** with title, content, category, and tags
- **View threads** with pagination and filtering
- **Update threads** (author only)
- **Delete threads** (author only)
- **Like/unlike threads**
- **Bookmark threads**
- **Pin threads** (admin feature)
- **Mark as answered**

### 💬 Reply System
- **Reply to threads** with rich content
- **Like/unlike replies**
- **Mark accepted answers**
- **Delete replies** (author only)
- **Edit replies** (author only)

### 🔍 Search & Filtering
- **Search by title, content, and tags**
- **Filter by categories**:
  - Skill Learning Help
  - Mentor Recommendations
  - Project Collaboration
  - General Skill Talk
  - Feedback Zone
  - Events & Meetups
  - Success Stories
  - Ask Me Anything (AMA)
- **Sort by**:
  - Recent (default)
  - Most Popular (likes)
  - Most Replies

### 📊 Real-time Features
- Live like counts
- Real-time reply updates
- Instant thread creation
- Dynamic bookmark status

## API Endpoints

### Threads
```
GET    /api/threads                    # Get all threads (with filters)
POST   /api/threads                    # Create new thread
GET    /api/threads/[id]              # Get specific thread with replies
PUT    /api/threads/[id]              # Update thread (author only)
DELETE /api/threads/[id]              # Delete thread (author only)
POST   /api/threads/[id]/like         # Like/unlike thread
POST   /api/threads/[id]/bookmark     # Bookmark/unbookmark thread
```

### Replies
```
GET    /api/threads/[id]/replies      # Get replies for thread
POST   /api/threads/[id]/replies      # Create new reply
PUT    /api/replies/[id]              # Update reply (author only)
DELETE /api/replies/[id]              # Delete reply (author only)
POST   /api/replies/[id]/like         # Like/unlike reply
```

## Database Models

### Thread Model
```typescript
interface IThread {
  _id: string;
  title: string;               // Required, 3-200 chars
  content: string;             // Required, 10-5000 chars
  author: ObjectId;            // Reference to User
  category: string;            // Enum of valid categories
  tags: string[];              // Array of tags (max 30 chars each)
  likes: ObjectId[];           // Array of User references
  bookmarks: ObjectId[];       // Array of User references
  replies: ObjectId[];         // Array of Reply references
  isPinned: boolean;           // Default false
  isAnswered: boolean;         // Default false
  createdAt: Date;
  updatedAt: Date;
}
```

### Reply Model
```typescript
interface IReply {
  _id: string;
  content: string;             // Required, 1-3000 chars
  author: ObjectId;            // Reference to User
  thread: ObjectId;            // Reference to Thread
  likes: ObjectId[];           // Array of User references
  isAcceptedAnswer: boolean;   // Default false
  createdAt: Date;
  updatedAt: Date;
}
```

## Frontend Service Layer

### Forum Service (`/lib/forumService.ts`)
Provides a clean API interface for all forum operations:

```typescript
// Thread operations
getThreads(category?, search?, sortBy?, page?, limit?)
getThread(threadId)
createThread(threadData)
updateThread(threadId, updateData)
deleteThread(threadId)
likeThread(threadId)
bookmarkThread(threadId)

// Reply operations
getReplies(threadId)
createReply(threadId, content)
updateReply(replyId, content)
deleteReply(replyId)
likeReply(replyId)
```

## Components

### Main Components
- `DiscussionPage` - Main forum interface with thread listing
- `ThreadDetail` - Individual thread view with replies
- Forum service integration with error handling
- Real-time updates and optimistic UI

### Key Features
- **Responsive design** - Works on all device sizes
- **Loading states** - Shows spinners during API calls
- **Error handling** - User-friendly error messages
- **Optimistic updates** - Immediate UI feedback
- **Pagination** - Efficient data loading
- **Debounced search** - Smooth search experience

## Getting Started

### 1. Database Setup
```bash
# Use the provided seed data
# Run the commands in /src/data/forum-seed.js in MongoDB
```

### 2. Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 4. Run the Application
```bash
npm run dev
```

## Usage Examples

### Creating a Thread
```typescript
const threadData = {
  title: "How to learn React?",
  content: "I'm new to React and need guidance...",
  category: "skill-help",
  tags: "React, Beginner, JavaScript"
};

await createThread(threadData);
```

### Searching Threads
```typescript
// Search by keyword
const results = await getThreads(undefined, "React");

// Filter by category
const skillHelpThreads = await getThreads("skill-help");

// Sort by popularity
const popularThreads = await getThreads(undefined, undefined, "popular");
```

### Adding a Reply
```typescript
await createReply(threadId, "Great question! Here's my advice...");
```

## Security Features

- **Input validation** on both client and server
- **SQL injection protection** via Mongoose
- **Authentication required** for write operations
- **Author-only permissions** for edit/delete
- **Rate limiting** (can be added)
- **Content sanitization** (can be enhanced)

## Performance Optimizations

- **Database indexing** on frequently queried fields
- **Pagination** to limit data transfer
- **Debounced search** to reduce API calls
- **Optimistic updates** for better UX
- **Lean queries** to minimize memory usage

## Future Enhancements

- [ ] **Rich text editor** for content formatting
- [ ] **File attachments** in threads and replies
- [ ] **Real-time notifications** using WebSockets
- [ ] **Mention system** for tagging users
- [ ] **Reputation system** based on helpful answers
- [ ] **Advanced moderation** tools
- [ ] **Email notifications** for replies
- [ ] **Thread following** functionality
- [ ] **Advanced search** with filters
- [ ] **Thread templates** for common question types

## Testing

The forum system is ready for testing with:
- Unit tests for API endpoints
- Integration tests for complete workflows
- E2E tests for user interactions
- Load testing for performance validation

## Contributing

When contributing to the forum system:

1. Follow the established patterns in the codebase
2. Add proper error handling for all operations
3. Include loading states for better UX
4. Validate all inputs on both client and server
5. Write tests for new functionality
6. Update documentation for API changes

## Support

For issues or questions about the forum system:
- Check the API error responses for debugging info
- Review the browser console for client-side errors
- Verify database connections and authentication
- Ensure all required environment variables are set
