import { withAuth } from "next-auth/middleware";
export default withAuth({ pages: { signIn: "/admin/login" }, callbacks: { authorized: ({ req, token }) => req.nextUrl.pathname === "/admin/login" || Boolean(token) } });
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
