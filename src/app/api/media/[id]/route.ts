import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { mediaAssetSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";
import { deleteObject } from "@/lib/s3";

// Admin: Update media asset
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
    const validated = mediaAssetSchema.partial().parse(body);

    const media = await prisma.mediaAsset.update({
      where: { id },
      data: validated,
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPDATE,
      entityType: EntityTypes.MEDIA,
      entityId: id,
      meta: { title: media.title },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Media update error:", error);
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
  }
}

// Admin: Delete media asset
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

    // Get the media to check for S3 key
    const media = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete from S3 if applicable
    if (media.s3Key) {
      try {
        await deleteObject(media.s3Key);
      } catch (s3Error) {
        console.error("S3 delete error:", s3Error);
      }
    }

    await prisma.mediaAsset.delete({
      where: { id },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.DELETE,
      entityType: EntityTypes.MEDIA,
      entityId: id,
      meta: { title: media.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
