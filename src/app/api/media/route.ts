import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { mediaAssetSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Public: Get media assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const decade = searchParams.get("decade");
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");

    const where: any = {};

    if (type) where.type = type;
    if (decade) where.decade = decade;
    if (featured) where.isFeatured = true;
    if (category) where.category = category;

    const media = await prisma.mediaAsset.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// Admin: Create media asset
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = mediaAssetSchema.parse(body);

    const media = await prisma.mediaAsset.create({
      data: validated,
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.CREATE,
      entityType: EntityTypes.MEDIA,
      entityId: media.id,
      meta: { title: media.title, type: media.type },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Media creation error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}
