import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/dashboard"]; // Add your protected routes here

const secret = new TextEncoder().encode("krrishkadamisahero");
// || "krrishkadamisahero";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("email-tracker-auth-token")?.value || // Adjust cookie name
    request.headers.get("Authorization")?.replace("Bearer ", "");

  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ Case 1: User is logged in
  if (token) {
    if (isProtectedRoute) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.next();
      } catch (error) {
        console.log("error jwt in middleware", error);
        // If token is expired or invalid
        const response = NextResponse.redirect(
          new URL("/sign-in", request.url)
        );
        response.cookies.delete("email-tracker-auth-token");
        return response;
      }
    }
    // ❌ Prevent access to signin/signup if logged in
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url)); // or home
    }
    // ✅ Allow access to everything else
    return NextResponse.next();
  }

  // ❌ Case 2: User is not logged in
  if (isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ✅ Allow access to public pages including /signin, /signup
  return NextResponse.next();
}
