import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAsset = pathname.startsWith("/_next") || pathname.includes(".");
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isAsset || isPublic) return NextResponse.next();

  const session = request.cookies.get("app_session")?.value;
  if (session === process.env.APP_ACCESS_CODE && process.env.APP_ACCESS_CODE) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api).*)"]
};
