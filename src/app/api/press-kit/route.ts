import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { pressKitSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Get press kit
export async function GET() {
  try {
    const pressKit = await prisma.pressKit.findFirst({
      where: { slug: "main" },
    });

    if (!pressKit) {
      return NextResponse.json({ error: "Press kit not found" }, { status: 404 });
    }

    return NextResponse.json(pressKit);
  } catch (error) {
    console.error("Press kit fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch press kit" }, { status: 500 });
  }
}

// Admin: Update or create press kit
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = pressKitSchema.parse(body);

    const pressKit = await prisma.pressKit.upsert({
      where: { slug: "main" },
      update: validated,
      create: {
        slug: "main",
        ...validated,
      },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPDATE,
      entityType: EntityTypes.PRESS_KIT,
      entityId: pressKit.id,
    });

    return NextResponse.json(pressKit);
  } catch (error) {
    console.error("Press kit update error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update press kit" }, { status: 500 });
  }
}
