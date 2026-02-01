import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedUploadUrl, generateS3Key, getPublicUrl } from "@/lib/s3";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Admin: Get presigned upload URL
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, contentType, folder = "uploads" } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    // Validate content type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "application/pdf",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate folder
    const allowedFolders = ["photos", "videos", "documents", "press", "uploads"];
    const safeFolder = allowedFolders.includes(folder) ? folder : "uploads";

    const s3Key = generateS3Key(safeFolder, filename);
    const uploadUrl = await getPresignedUploadUrl(s3Key, contentType);
    const publicUrl = getPublicUrl(s3Key);

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPLOAD,
      entityType: EntityTypes.MEDIA,
      meta: { filename, folder: safeFolder },
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
