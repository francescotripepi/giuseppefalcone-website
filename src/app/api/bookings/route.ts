import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { bookingRequestSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Create booking request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = bookingRequestSchema.parse(body);

    const booking = await prisma.bookingRequest.create({
      data: {
        ...validated,
        eventDate: new Date(validated.eventDate),
      },
    });

    await logAudit({
      action: AuditActions.CREATE,
      entityType: EntityTypes.BOOKING,
      entityId: booking.id,
      meta: { email: validated.email },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    return NextResponse.json({ success: true, id: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

// Admin: Get all bookings
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = status ? { status: status as any } : {};

    const [bookings, total] = await Promise.all([
      prisma.bookingRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookingRequest.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
