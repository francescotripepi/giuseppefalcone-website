import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Get published events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const featured = searchParams.get("featured") === "true";
    const all = searchParams.get("all") === "true";

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    const where: any = {};

    // Only admins can see unpublished events
    if (!isAdmin || !all) {
      where.isPublished = true;
    }

    if (upcoming) {
      where.startAt = { gte: new Date() };
    }

    if (featured) {
      where.isFeatured = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startAt: upcoming ? "asc" : "desc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// Admin: Create event
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...validated,
        startAt: new Date(validated.startAt),
        endAt: validated.endAt ? new Date(validated.endAt) : null,
        ticketUrl: validated.ticketUrl || null,
      },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.CREATE,
      entityType: EntityTypes.EVENT,
      entityId: event.id,
      meta: { title: event.title },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
