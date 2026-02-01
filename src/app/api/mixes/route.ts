import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { mixSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Get mixes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const decade = searchParams.get("decade");
    const featured = searchParams.get("featured") === "true";
    const all = searchParams.get("all") === "true";

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    const where: any = {};

    if (!isAdmin || !all) {
      where.isPublished = true;
    }

    if (decade) where.decade = decade;
    if (featured) where.isFeatured = true;

    const mixes = await prisma.mix.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(mixes);
  } catch (error) {
    console.error("Mixes fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch mixes" }, { status: 500 });
  }
}

// Admin: Create mix
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = mixSchema.parse(body);

    const mix = await prisma.mix.create({
      data: validated,
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.CREATE,
      entityType: EntityTypes.MIX,
      entityId: mix.id,
      meta: { title: mix.title },
    });

    return NextResponse.json(mix, { status: 201 });
  } catch (error) {
    console.error("Mix creation error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create mix" }, { status: 500 });
  }
}
