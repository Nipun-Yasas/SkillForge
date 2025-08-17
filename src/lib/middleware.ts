import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import connectDB from "./mongodb";
import User from "@/models/User";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function authenticateUser(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: string }> {
  try {
    await connectDB();

    // Get token from cookies or Authorization header
    let token = request.cookies.get("token")?.value;
    
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { user: null, error: "Authentication token not found" };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return { user: null, error: "Invalid or expired token" };
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return { user: null, error: "User not found" };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Authentication error:", error);
    return { user: null, error: "Authentication failed" };
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: error || "Authentication required" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Add user to request object
    (request as AuthenticatedRequest).user = user;
    
    return handler(request as AuthenticatedRequest, user);
  };
}
