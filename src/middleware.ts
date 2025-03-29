import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  permissions: string[];
  [key: string]: unknown;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  // console.log("Token:", token);
  const { pathname } = req.nextUrl;

  if (token) {
    try {
      const { payload } = await jwtVerify<JWTPayload>(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      // console.log("User payload:", payload);

      const userPermissions = payload.permissions || [];
      // console.log("User permissions:", userPermissions);

      const pathParts = pathname.split("/").filter((p) => p);
      // eslint-disable-next-line @next/next/no-assign-module-variable
      let module = "dashboard";
      if (pathParts.length > 1 && pathParts[0] === "dashboard") {
        module = pathParts[1];
      }
      console.log("Accessing module:", module);

      if (
        pathname === "/dashboard/access-denied" ||
        pathname === "/dashboard"
      ) {
        return NextResponse.next();
      }

      if (!userPermissions.includes(module)) {
        return NextResponse.redirect(
          new URL("/dashboard/access-denied", req.url)
        );
      }
    } catch (error) {
      console.log("JWT verification error:", error);
      const response = NextResponse.redirect(new URL("/sign-in", req.url));
      response.cookies.delete("token");
      return response;
    }
  } else if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}
