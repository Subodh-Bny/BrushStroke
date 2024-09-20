import { NextResponse, NextRequest } from "next/server";
import routes from "./config/routes";

export const middleware = (request: NextRequest) => {
  // console.log("Middleware is running for URL:", request.nextUrl.pathname);
  const token = request.cookies.get("jwt");
  // console.log(request.cookies);
  const url = request.nextUrl.clone();

  if (token && url.pathname.startsWith("/auth")) {
    url.pathname = routes.landing.home;
    // console.log(token, url.pathname);
    return NextResponse.redirect(url);
  }
  if (!token && url.pathname.startsWith("/admin")) {
    url.pathname = routes.landing.home;
    // console.log(token, url.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/auth/:path*", "/"],
};
