import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Only admins can see unpublished events
    if (!event.isPublished && !session) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Event fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// Admin: Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = eventSchema.partial().parse(body);

    const updateData: any = { ...validated };
    if (validated.startAt) updateData.startAt = new Date(validated.startAt);
    if (validated.endAt) updateData.endAt = new Date(validated.endAt);
    if (validated.ticketUrl === "") updateData.ticketUrl = null;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPDATE,
      entityType: EntityTypes.EVENT,
      entityId: id,
      meta: { title: event.title },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Event update error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// Admin: Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const event = await prisma.event.delete({
      where: { id },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.DELETE,
      entityType: EntityTypes.EVENT,
      entityId: id,
      meta: { title: event.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event delete error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
