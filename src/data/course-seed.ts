import mongoose from "mongoose";
import Course from "../models/Course";
import User from "../models/User";
import CourseEnrollment from "../models/CourseEnrollment";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skillforge";

const sampleCourses = [
  {
    title: "Complete JavaScript Mastery",
    description: "Master JavaScript from basics to advanced concepts with hands-on projects.",
    longDescription: "This comprehensive JavaScript course takes you from absolute beginner to advanced developer. You'll learn ES6+ features, DOM manipulation, async programming, and modern JavaScript frameworks. Build real-world projects including a weather app, task manager, and e-commerce site.",
    duration: "8 weeks",
    level: "Intermediate",
    price: 0,
    isPremium: false,
    image: "/api/placeholder/300/200",
    tags: ["JavaScript", "Web Development", "Frontend", "ES6", "DOM"],
    category: "Programming",
    prerequisites: ["Basic HTML and CSS knowledge"],
    learningOutcomes: [
      "Master JavaScript fundamentals and ES6+ features",
      "Build interactive web applications",
      "Understand asynchronous programming",
      "Work with APIs and fetch data",
      "Debug and optimize JavaScript code"
    ],
    modules: [
      {
        id: "js-1",
        title: "JavaScript Fundamentals",
        description: "Variables, data types, functions, and control structures",
        duration: "120 minutes",
        resources: [
          {
            title: "Introduction to JavaScript",
            url: "/videos/js-intro",
            type: "video"
          },
          {
            title: "JavaScript Cheat Sheet",
            url: "/resources/js-cheatsheet.pdf",
            type: "pdf"
          }
        ]
      },
      {
        id: "js-2",
        title: "DOM Manipulation",
        description: "Selecting elements, event handling, and dynamic content",
        duration: "150 minutes",
        resources: [
          {
            title: "DOM Basics",
            url: "/videos/dom-basics",
            type: "video"
          }
        ]
      },
      {
        id: "js-3",
        title: "Asynchronous JavaScript",
        description: "Promises, async/await, and API calls",
        duration: "180 minutes",
        resources: [
          {
            title: "Async Programming",
            url: "/videos/async-js",
            type: "video"
          },
          {
            title: "Practice Quiz",
            url: "/quiz/async-js",
            type: "quiz"
          }
        ]
      }
    ],
    totalDuration: 450,
    isPublished: true,
    publishedAt: new Date("2024-01-15"),
    rating: 4.8,
    totalRatings: 245,
    enrolledStudents: 1200
  },
  {
    title: "React for Beginners",
    description: "Learn React fundamentals and build your first web applications.",
    longDescription: "Start your React journey with this beginner-friendly course. Learn components, state management, hooks, and routing. Build three projects: a todo app, weather dashboard, and blog website.",
    duration: "6 weeks",
    level: "Beginner",
    price: 0,
    isPremium: false,
    image: "/api/placeholder/300/200",
    tags: ["React", "Frontend", "Components", "Hooks", "JSX"],
    category: "Programming",
    prerequisites: ["Basic JavaScript knowledge"],
    learningOutcomes: [
      "Understand React components and JSX",
      "Manage state with hooks",
      "Handle events and forms",
      "Implement routing with React Router",
      "Deploy React applications"
    ],
    modules: [
      {
        id: "react-1",
        title: "React Basics",
        description: "Components, JSX, and props",
        duration: "90 minutes",
        resources: [
          {
            title: "React Introduction",
            url: "/videos/react-intro",
            type: "video"
          }
        ]
      },
      {
        id: "react-2",
        title: "State and Events",
        description: "useState hook and event handling",
        duration: "120 minutes",
        resources: [
          {
            title: "State Management",
            url: "/videos/react-state",
            type: "video"
          }
        ]
      },
      {
        id: "react-3",
        title: "React Router",
        description: "Navigation and routing in React apps",
        duration: "100 minutes",
        resources: [
          {
            title: "Routing Basics",
            url: "/videos/react-router",
            type: "video"
          }
        ]
      }
    ],
    totalDuration: 310,
    isPublished: true,
    publishedAt: new Date("2024-02-01"),
    rating: 4.9,
    totalRatings: 189,
    enrolledStudents: 890
  },
  {
    title: "Python Data Science",
    description: "Comprehensive data science course using Python and popular libraries.",
    longDescription: "Dive deep into data science with Python. Learn pandas, numpy, matplotlib, and scikit-learn. Work with real datasets and build machine learning models. Perfect for aspiring data scientists.",
    duration: "10 weeks",
    level: "Advanced",
    price: 0,
    isPremium: false,
    image: "/api/placeholder/300/200",
    tags: ["Python", "Data Science", "Machine Learning", "Pandas", "NumPy"],
    category: "Data Science",
    prerequisites: ["Python programming basics", "Basic statistics knowledge"],
    learningOutcomes: [
      "Analyze data with pandas and numpy",
      "Create visualizations with matplotlib",
      "Build machine learning models",
      "Work with real-world datasets",
      "Deploy ML models to production"
    ],
    modules: [
      {
        id: "ds-1",
        title: "Data Analysis with Pandas",
        description: "Data cleaning, manipulation, and analysis",
        duration: "200 minutes",
        resources: [
          {
            title: "Pandas Tutorial",
            url: "/videos/pandas-basics",
            type: "video"
          }
        ]
      },
      {
        id: "ds-2",
        title: "Data Visualization",
        description: "Creating charts and graphs with matplotlib",
        duration: "150 minutes",
        resources: [
          {
            title: "Matplotlib Guide",
            url: "/videos/matplotlib",
            type: "video"
          }
        ]
      },
      {
        id: "ds-3",
        title: "Machine Learning",
        description: "Supervised and unsupervised learning",
        duration: "250 minutes",
        resources: [
          {
            title: "ML Fundamentals",
            url: "/videos/ml-basics",
            type: "video"
          }
        ]
      }
    ],
    totalDuration: 600,
    isPublished: true,
    publishedAt: new Date("2024-01-20"),
    rating: 4.7,
    totalRatings: 156,
    enrolledStudents: 620
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design.",
    longDescription: "Master the art of UI/UX design with this comprehensive course. Learn design principles, user research, wireframing, prototyping, and usability testing. Use Figma to create stunning designs.",
    duration: "5 weeks",
    level: "Beginner",
    price: 0,
    isPremium: false,
    image: "/api/placeholder/300/200",
    tags: ["Design", "UI/UX", "Figma", "Wireframing", "Prototyping"],
    category: "Design",
    prerequisites: ["No prior experience required"],
    learningOutcomes: [
      "Understand design principles and theory",
      "Conduct user research and testing",
      "Create wireframes and prototypes",
      "Design user interfaces in Figma",
      "Build a professional design portfolio"
    ],
    modules: [
      {
        id: "ux-1",
        title: "Design Principles",
        description: "Color theory, typography, and layout",
        duration: "90 minutes",
        resources: [
          {
            title: "Design Basics",
            url: "/videos/design-principles",
            type: "video"
          }
        ]
      },
      {
        id: "ux-2",
        title: "User Research",
        description: "Understanding user needs and behaviors",
        duration: "120 minutes",
        resources: [
          {
            title: "User Research Methods",
            url: "/videos/user-research",
            type: "video"
          }
        ]
      },
      {
        id: "ux-3",
        title: "Prototyping with Figma",
        description: "Creating interactive prototypes",
        duration: "140 minutes",
        resources: [
          {
            title: "Figma Tutorial",
            url: "/videos/figma-basics",
            type: "video"
          }
        ]
      }
    ],
    totalDuration: 350,
    isPublished: true,
    publishedAt: new Date("2024-02-10"),
    rating: 4.6,
    totalRatings: 98,
    enrolledStudents: 450
  },
  {
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express.",
    longDescription: "Learn server-side development with Node.js. Build REST APIs, work with databases, implement authentication, and deploy to the cloud. Perfect for full-stack developers.",
    duration: "7 weeks",
    level: "Intermediate",
    price: 0,
    isPremium: false,
    image: "/api/placeholder/300/200",
    tags: ["Node.js", "Express", "Backend", "API", "MongoDB"],
    category: "Programming",
    prerequisites: ["JavaScript fundamentals", "Basic understanding of databases"],
    learningOutcomes: [
      "Build REST APIs with Express",
      "Work with MongoDB databases",
      "Implement user authentication",
      "Handle file uploads and security",
      "Deploy applications to production"
    ],
    modules: [
      {
        id: "node-1",
        title: "Node.js Fundamentals",
        description: "Modules, file system, and async programming",
        duration: "110 minutes",
        resources: [
          {
            title: "Node.js Basics",
            url: "/videos/nodejs-intro",
            type: "video"
          }
        ]
      },
      {
        id: "node-2",
        title: "Express Framework",
        description: "Building web servers and APIs",
        duration: "160 minutes",
        resources: [
          {
            title: "Express Tutorial",
            url: "/videos/express-basics",
            type: "video"
          }
        ]
      },
      {
        id: "node-3",
        title: "Database Integration",
        description: "Working with MongoDB and Mongoose",
        duration: "180 minutes",
        resources: [
          {
            title: "MongoDB Guide",
            url: "/videos/mongodb-mongoose",
            type: "video"
          }
        ]
      }
    ],
    totalDuration: 450,
    isPublished: true,
    publishedAt: new Date("2024-01-25"),
    rating: 4.5,
    totalRatings: 123,
    enrolledStudents: 380
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing courses
    await Course.deleteMany({});
    await CourseEnrollment.deleteMany({});
    console.log("Cleared existing courses and enrollments");

    // Find a mentor user to be the instructor
    let mentorUser = await User.findOne({ role: { $in: ["mentor", "both"] } });
    
    if (!mentorUser) {
      // Create a sample mentor if none exists
      mentorUser = new User({
        name: "Dr. Sarah Chen",
        email: "sarah.chen@skillforge.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LQ1Gv.6FqRVznutyhN2gUkr8fCgRpEh6rrpK.", // hashed "password123"
        role: "mentor",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        bio: "Experienced full-stack developer and educator with 10+ years in the industry.",
        skills: {
          teaching: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
          learning: ["Machine Learning", "DevOps"]
        },
        experience: "expert",
        location: "San Francisco, CA",
        isEmailVerified: true
      });
      await mentorUser.save();
      console.log("Created sample mentor user");
    }

    // Add instructor info to each course
    const coursesWithInstructor = sampleCourses.map(course => ({
      ...course,
      instructor: {
        id: mentorUser._id.toString(),
        name: mentorUser.name,
        avatar: mentorUser.avatar,
        bio: mentorUser.bio
      }
    }));

    // Insert sample courses
    const insertedCourses = await Course.insertMany(coursesWithInstructor);
    console.log(`Inserted ${insertedCourses.length} courses`);

    // Create some sample enrollments
    const learnerUsers = await User.find({ role: { $in: ["learner", "both"] } }).limit(5);
    
    if (learnerUsers.length > 0) {
      const enrollments = [];
      
      for (const user of learnerUsers) {
        // Enroll in 2-3 random courses
        const numEnrollments = Math.floor(Math.random() * 2) + 2;
        const shuffledCourses = insertedCourses.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numEnrollments && i < shuffledCourses.length; i++) {
          const course = shuffledCourses[i];
          const progress = Math.floor(Math.random() * 101); // 0-100%
          const completedModules = [];
          
          // Add completed modules based on progress
          const totalModules = course.modules.length;
          const completedCount = Math.floor((progress / 100) * totalModules);
          
          for (let j = 0; j < completedCount; j++) {
            completedModules.push(course.modules[j].id);
          }
          
          enrollments.push({
            userId: user._id.toString(),
            courseId: course._id.toString(),
            enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
            progress,
            completedModules,
            currentModule: completedModules.length > 0 ? completedModules[completedModules.length - 1] : course.modules[0]?.id,
            timeSpent: Math.floor(Math.random() * 500) + 60, // 60-560 minutes
            lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
            completedAt: progress === 100 ? new Date() : undefined,
            rating: progress > 50 ? Math.floor(Math.random() * 2) + 4 : undefined, // 4-5 stars for completed/near-completed courses
          });
        }
      }
      
      if (enrollments.length > 0) {
        await CourseEnrollment.insertMany(enrollments);
        console.log(`Created ${enrollments.length} sample enrollments`);
      }
    }

    console.log("✅ Course seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedCourses();
