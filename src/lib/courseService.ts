import Course, { ICourse } from "@/models/Course";
import CourseEnrollment, { ICourseEnrollment } from "@/models/CourseEnrollment";
import User from "@/models/User";
import connectDB from "./mongodb";

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  tags?: string[];
  instructor?: string;
  isPremium?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: "title" | "rating" | "enrolledStudents" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CourseWithProgress extends ICourse {
  progress?: number;
  isEnrolled?: boolean;
  enrollmentId?: string;
  lastAccessedAt?: Date;
}

export class CourseService {
  static async getCourses(
    filters: CourseFilters = {},
    userId?: string
  ): Promise<{
    courses: CourseWithProgress[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    await connectDB();

    const {
      search,
      category,
      level,
      tags,
      instructor,
      isPremium,
      minRating,
      page = 1,
      limit = 12,
      sortBy = "enrolledStudents",
      sortOrder = "desc",
    } = filters;

    // Build query
    const query: any = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== "All Categories") {
      query.category = { $regex: category, $options: "i" };
    }

    if (level && level !== "All Levels") {
      query.level = level;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (instructor) {
      query["instructor.id"] = instructor;
    }

    if (isPremium !== undefined) {
      query.isPremium = isPremium;
    }

    if (minRating) {
      query.rating = { $gte: minRating };
    }

    // Build sort
    const sort: any = {};
    if (search) {
      sort.score = { $meta: "textScore" };
    }
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [courses, totalCount] = await Promise.all([
      Course.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Course.countDocuments(query),
    ]);

    // Get user enrollment data if userId provided
    let coursesWithProgress: CourseWithProgress[] = courses as CourseWithProgress[];

    if (userId) {
      const enrollments = await CourseEnrollment.find({
        userId,
        courseId: { $in: courses.map((c) => c._id) },
        isActive: true,
      }).lean();

      const enrollmentMap = new Map(
        enrollments.map((e) => [e.courseId.toString(), e])
      );

      coursesWithProgress = courses.map((course) => {
        const enrollment = enrollmentMap.get(course._id.toString());
        return {
          ...course,
          progress: enrollment?.progress || 0,
          isEnrolled: !!enrollment,
          enrollmentId: enrollment?._id.toString(),
          lastAccessedAt: enrollment?.lastAccessedAt,
        };
      });
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses: coursesWithProgress,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }

  static async getCourseById(
    courseId: string,
    userId?: string
  ): Promise<CourseWithProgress | null> {
    await connectDB();

    const course = await Course.findById(courseId).lean();
    if (!course) return null;

    let courseWithProgress: CourseWithProgress = course as CourseWithProgress;

    if (userId) {
      const enrollment = await CourseEnrollment.findOne({
        userId,
        courseId,
        isActive: true,
      }).lean();

      if (enrollment) {
        courseWithProgress = {
          ...course,
          progress: enrollment.progress,
          isEnrolled: true,
          enrollmentId: enrollment._id.toString(),
          lastAccessedAt: enrollment.lastAccessedAt,
        };
      }
    }

    return courseWithProgress;
  }

  static async enrollInCourse(
    userId: string,
    courseId: string
  ): Promise<{ success: boolean; message: string; enrollment?: ICourseEnrollment }> {
    await connectDB();

    try {
      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return { success: false, message: "Course not found" };
      }

      if (!course.isPublished) {
        return { success: false, message: "Course is not available" };
      }

      // Check if user is already enrolled
      const existingEnrollment = await CourseEnrollment.findOne({
        userId,
        courseId,
      });

      if (existingEnrollment) {
        if (existingEnrollment.isActive) {
          return { success: false, message: "Already enrolled in this course" };
        } else {
          // Reactivate enrollment
          existingEnrollment.isActive = true;
          existingEnrollment.lastAccessedAt = new Date();
          await existingEnrollment.save();

          return {
            success: true,
            message: "Successfully re-enrolled in course",
            enrollment: existingEnrollment,
          };
        }
      }

      // Create new enrollment
      const enrollment = new CourseEnrollment({
        userId,
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
      });

      await enrollment.save();

      // Update course enrollment count
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledStudents: 1 },
      });

      return {
        success: true,
        message: "Successfully enrolled in course",
        enrollment,
      };
    } catch (error) {
      console.error("Enrollment error:", error);
      return { success: false, message: "Failed to enroll in course" };
    }
  }

  static async updateProgress(
    userId: string,
    courseId: string,
    moduleId: string,
    timeSpent?: number
  ): Promise<{ success: boolean; message: string; progress?: number }> {
    await connectDB();

    try {
      const enrollment = await CourseEnrollment.findOne({
        userId,
        courseId,
        isActive: true,
      });

      if (!enrollment) {
        return { success: false, message: "Enrollment not found" };
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return { success: false, message: "Course not found" };
      }

      // Add module to completed if not already there
      if (!enrollment.completedModules.includes(moduleId)) {
        enrollment.completedModules.push(moduleId);
      }

      // Calculate progress percentage
      const totalModules = course.modules.length;
      const completedCount = enrollment.completedModules.length;
      const progress = Math.round((completedCount / totalModules) * 100);

      enrollment.progress = progress;
      enrollment.currentModule = moduleId;
      enrollment.lastAccessedAt = new Date();

      if (timeSpent) {
        enrollment.timeSpent += timeSpent;
      }

      // Mark as completed if 100% progress
      if (progress >= 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date();
      }

      await enrollment.save();

      return {
        success: true,
        message: "Progress updated successfully",
        progress,
      };
    } catch (error) {
      console.error("Progress update error:", error);
      return { success: false, message: "Failed to update progress" };
    }
  }

  static async rateCourse(
    userId: string,
    courseId: string,
    rating: number,
    review?: string
  ): Promise<{ success: boolean; message: string }> {
    await connectDB();

    try {
      if (rating < 1 || rating > 5) {
        return { success: false, message: "Rating must be between 1 and 5" };
      }

      const enrollment = await CourseEnrollment.findOne({
        userId,
        courseId,
        isActive: true,
      });

      if (!enrollment) {
        return { success: false, message: "Must be enrolled to rate course" };
      }

      const oldRating = enrollment.rating;

      // Update enrollment with rating
      enrollment.rating = rating;
      if (review) {
        enrollment.review = review;
      }
      await enrollment.save();

      // Update course rating
      const course = await Course.findById(courseId);
      if (course) {
        if (oldRating) {
          // Update existing rating
          const totalRating = course.rating * course.totalRatings;
          const newTotalRating = totalRating - oldRating + rating;
          course.rating = newTotalRating / course.totalRatings;
        } else {
          // New rating
          const totalRating = course.rating * course.totalRatings + rating;
          course.totalRatings += 1;
          course.rating = totalRating / course.totalRatings;
        }

        await course.save();
      }

      return { success: true, message: "Course rated successfully" };
    } catch (error) {
      console.error("Rating error:", error);
      return { success: false, message: "Failed to rate course" };
    }
  }

  static async getCategories(): Promise<string[]> {
    await connectDB();

    const categories = await Course.distinct("category", { isPublished: true });
    return ["All Categories", ...categories.sort()];
  }

  static async getUserEnrollments(
    userId: string,
    status?: "active" | "completed" | "all"
  ): Promise<CourseWithProgress[]> {
    await connectDB();

    const query: any = { userId, isActive: true };

    if (status === "completed") {
      query.progress = 100;
    } else if (status === "active") {
      query.progress = { $lt: 100 };
    }

    const enrollments = await CourseEnrollment.find(query)
      .populate({
        path: "courseId",
        model: Course,
        match: { isPublished: true },
      })
      .lean();

    const coursesWithProgress: CourseWithProgress[] = enrollments
      .filter((e) => e.courseId) // Filter out enrollments where course was deleted
      .map((enrollment) => ({
        ...(enrollment.courseId as any),
        progress: enrollment.progress,
        isEnrolled: true,
        enrollmentId: enrollment._id.toString(),
        lastAccessedAt: enrollment.lastAccessedAt,
      }));

    return coursesWithProgress;
  }
}

export default CourseService;
