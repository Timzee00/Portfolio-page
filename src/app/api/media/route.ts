import { NextRequest, NextResponse } from "next/server";

const MEDIA_PATH = "/storage/v1/object/public/portfolio-media/";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return new NextResponse("Missing media URL", { status: 400 });

  try {
    const target = new URL(rawUrl);
    const configured = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configured) return new NextResponse("Media service is not configured", { status: 500 });

    const supabaseHost = new URL(configured).hostname;
    if (target.hostname !== supabaseHost || !target.pathname.startsWith(MEDIA_PATH)) {
      return new NextResponse("Invalid media URL", { status: 400 });
    }

    const response = await fetch(target.toString(), {
      cache: "no-store",
      headers: { Accept: "image/*,video/*,application/pdf" },
    });

    if (!response.ok || !response.body) {
      return new NextResponse("Media unavailable", { status: response.status || 404 });
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!/^(image|video)\//i.test(contentType) && contentType !== "application/pdf") {
      return new NextResponse("Unsupported media type", { status: 415 });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Invalid media URL", { status: 400 });
  }
}
