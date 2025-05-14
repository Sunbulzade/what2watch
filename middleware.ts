// Imports - Node
import { NextResponse } from "next/server";

// Import Types - Node
import type { NextFetchEvent, NextRequest } from "next/server";

async function rootMiddleware(request: NextRequest, _event: NextFetchEvent) {
	const { pathname } = request.nextUrl;
	const isApiRoute = new RegExp("^/api(/.*)?$").test(pathname);

	if (isApiRoute) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

const config = {
	matcher: [],
};

// Exports
export { rootMiddleware as default, config };
