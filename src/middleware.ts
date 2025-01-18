import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/verify")
  ) {
    // user is signed in and trying to access sign in, sign up, or verify page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));    
  }

  // Allow access to home page for logged-in users
  if (token && url.pathname === "/") {
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-up", "/sign-in", "/verify/:path*", "/", "/dashboard/:path*"],
};
