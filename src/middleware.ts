// src/middleware.ts
import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works:
// https://next-auth.js.org/configuration/nextjs#middleware

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // `/profile` requires the user to be logged in
      if (req.nextUrl.pathname.startsWith("/auth/profile")) {
        return !!token; // Must have a token (be logged in)
      }
      // TODO: Add other protected routes here, e.g., submitting solutions, creating katas
      // if (req.nextUrl.pathname.startsWith("/katas/new")) {
      //   return !!token;
      // }
      // if (req.nextUrl.pathname.includes("/solve")) { // Example for kata solving page
      //   return !!token;
      // }
      return true; // Allow access by default for other routes
    },
  },
  pages: {
    signIn: "/auth/signin", // Redirect unauthenticated users to this page
    error: "/auth/error",
  },
});

// Define which paths the middleware should run on
export const config = {
  matcher: [
    "/auth/profile",
    // Add other protected paths here
    // "/katas/new",
    // "/katas/:id/solve",
  ],
};

