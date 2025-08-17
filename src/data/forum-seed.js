// Forum seeding script - run this in MongoDB Compass or MongoDB shell

// Sample users (make sure to hash passwords properly in real scenario)
const sampleUsers = [
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "Alex Chen",
    email: "alex@example.com",
    password: "$2b$12$somehashedpassword1",
    role: "learner",
    avatar: "/alex.png",
    skills: {
      teaching: [],
      learning: ["JavaScript", "React"]
    },
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "$2b$12$somehashedpassword2",
    role: "mentor",
    avatar: "/sarah.png",
    skills: {
      teaching: ["React", "Node.js"],
      learning: ["TypeScript"]
    },
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439013"),
    name: "Mike Rodriguez",
    email: "mike@example.com",
    password: "$2b$12$somehashedpassword3",
    role: "both",
    avatar: "/mike.png",
    skills: {
      teaching: ["Frontend", "Backend"],
      learning: ["DevOps"]
    },
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample threads
const sampleThreads = [
  {
    _id: ObjectId("507f1f77bcf86cd799439021"),
    title: "How do I get started with JavaScript?",
    content: "I'm completely new to programming and want to learn JavaScript. What's the best roadmap to follow? I've heard about different resources but don't know where to start. Should I focus on theory first or jump into practical projects?",
    author: ObjectId("507f1f77bcf86cd799439011"),
    category: "skill-help",
    tags: ["JavaScript", "Beginner", "Roadmap"],
    likes: [ObjectId("507f1f77bcf86cd799439012"), ObjectId("507f1f77bcf86cd799439013")],
    bookmarks: [ObjectId("507f1f77bcf86cd799439012")],
    replies: [],
    isPinned: false,
    isAnswered: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    title: "Looking for a React mentor who's beginner-friendly",
    content: "I've been learning React for a month and need guidance on best practices and project structure. Looking for someone patient who can help me understand complex concepts.",
    author: ObjectId("507f1f77bcf86cd799439011"),
    category: "mentor-recommendations",
    tags: ["React", "Mentorship", "Beginner"],
    likes: [ObjectId("507f1f77bcf86cd799439012")],
    bookmarks: [],
    replies: [],
    isPinned: false,
    isAnswered: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439023"),
    title: "Frontend dev here! Looking for someone to help with backend",
    content: "Working on a productivity app using React. Need help with Node.js, Express, and database design. Anyone interested in collaborating?",
    author: ObjectId("507f1f77bcf86cd799439013"),
    category: "project-collaboration",
    tags: ["Frontend", "Backend", "Node.js", "Collaboration"],
    likes: [ObjectId("507f1f77bcf86cd799439011"), ObjectId("507f1f77bcf86cd799439012")],
    bookmarks: [ObjectId("507f1f77bcf86cd799439011")],
    replies: [],
    isPinned: true,
    isAnswered: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

// Sample replies
const sampleReplies = [
  {
    _id: ObjectId("507f1f77bcf86cd799439031"),
    content: "Start with FreeCodeCamp's JavaScript course. It's comprehensive and completely free. Then move to practical projects to solidify your understanding. I recommend starting with simple DOM manipulation projects.",
    author: ObjectId("507f1f77bcf86cd799439012"),
    thread: ObjectId("507f1f77bcf86cd799439021"),
    likes: [ObjectId("507f1f77bcf86cd799439011"), ObjectId("507f1f77bcf86cd799439013")],
    isAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439032"),
    content: "I'd recommend starting with JavaScript30 by Wes Bos after you understand the basics. Building real projects helps a lot! Also, don't skip the fundamentals - understanding closures and async programming is crucial.",
    author: ObjectId("507f1f77bcf86cd799439013"),
    thread: ObjectId("507f1f77bcf86cd799439021"),
    likes: [ObjectId("507f1f77bcf86cd799439011")],
    isAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439033"),
    content: "Don't forget to practice algorithms on platforms like LeetCode or Codewars. It helps with problem-solving skills. Start with easy problems and gradually work your way up.",
    author: ObjectId("507f1f77bcf86cd799439011"),
    thread: ObjectId("507f1f77bcf86cd799439021"),
    likes: [],
    isAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    updatedAt: new Date(Date.now() - 45 * 60 * 1000)
  }
];

// Instructions to seed the database:
/*
1. Make sure MongoDB is running
2. Connect to your database using MongoDB Compass or CLI
3. Insert the sample data:

db.users.insertMany(sampleUsers);
db.threads.insertMany(sampleThreads);
db.replies.insertMany(sampleReplies);

4. Update threads with reply references:
db.threads.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439021") },
  { $set: { replies: [
    ObjectId("507f1f77bcf86cd799439031"),
    ObjectId("507f1f77bcf86cd799439032"),
    ObjectId("507f1f77bcf86cd799439033")
  ]}}
);

5. Verify the data:
db.threads.find().pretty();
db.replies.find().pretty();
db.users.find().pretty();
*/
