import { type NextRequest, NextResponse } from "next/server";

const backendBaseUrl =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function proxy(request: NextRequest, method: string, path: string[]) {
	const targetUrl = new URL(`/api/${path.join("/")}`, backendBaseUrl);
	if (request.nextUrl.search) targetUrl.search = request.nextUrl.search;

	const headers = new Headers(request.headers);
	headers.delete("host");

	const init: RequestInit = {
		method,
		headers,
		// Duplex is required in some runtimes when passing a stream body.
		// @ts-expect-error - runtime-specific
		duplex: "half",
	};

	if (method !== "GET" && method !== "HEAD") {
		init.body = request.body;
	}

	let response: Response;
	try {
		response = await fetch(targetUrl.toString(), init);
	} catch {
		return NextResponse.json(
			{ message: "Backend API unavailable" },
			{ status: 502 },
		);
	}

	const responseHeaders = new Headers(response.headers);
	// Avoid passing through encoding/length issues when streaming through Next.
	responseHeaders.delete("content-encoding");
	responseHeaders.delete("content-length");

	return new NextResponse(response.body, {
		status: response.status,
		headers: responseHeaders,
	});
}

export async function GET(
	request: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	const { path } = await ctx.params;
	return proxy(request, "GET", path);
}

export async function POST(
	request: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	const { path } = await ctx.params;
	return proxy(request, "POST", path);
}

export async function PUT(
	request: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	const { path } = await ctx.params;
	return proxy(request, "PUT", path);
}

export async function PATCH(
	request: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	const { path } = await ctx.params;
	return proxy(request, "PATCH", path);
}

export async function DELETE(
	request: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	const { path } = await ctx.params;
	return proxy(request, "DELETE", path);
}
