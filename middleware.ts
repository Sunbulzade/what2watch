// Imports - Node
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Import Types - Node
import type { NextFetchEvent, NextRequest } from "next/server";

async function rootMiddleware(request: NextRequest, _event: NextFetchEvent) {
	const { pathname } = request.nextUrl;
	const isApiRoute = new RegExp("^/api(/.*)?$").test(pathname);
	
	// These paths are always accessible
	const publicPaths = ['/login', '/signup', '/', '/movies', '/movies/[id]'];
	const isPublicPath = publicPaths.some(path => 
		path.includes('[id]') 
			? new RegExp(`^${path.replace('[id]', '[^/]+')}$`).test(pathname) 
			: path === pathname
	);

	if (isApiRoute || isPublicPath) {
		return NextResponse.next();
	}

	// Check for authenticated session
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Redirect to login if no token and accessing protected route
	if (!token) {
		const url = new URL('/login', request.url);
		url.searchParams.set('callbackUrl', encodeURI(pathname));
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export default rootMiddleware;

export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. /_static (inside /public)
		 * 4. all root files inside /public (e.g. /favicon.ico)
		 */
		'/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
	],
};
