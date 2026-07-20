import { NextResponse } from "next/server";

import {
  getWebsiteVisitCount,
  incrementWebsiteVisitCount,
  shouldCountWebsiteVisit,
} from "@/lib/websiteVisits";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getWebsiteVisitCount();
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  if (!shouldCountWebsiteVisit(request)) {
    const count = await getWebsiteVisitCount();
    return NextResponse.json({ count, skipped: true });
  }

  const count = await incrementWebsiteVisitCount();
  return NextResponse.json({ count });
}
