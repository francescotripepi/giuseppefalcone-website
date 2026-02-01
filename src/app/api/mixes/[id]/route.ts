import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { mixSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";

// Admin: Update mix
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
    const validated = mixSchema.partial().parse(body);

    const mix = await prisma.mix.update({
      where: { id },
      data: validated,
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPDATE,
      entityType: EntityTypes.MIX,
      entityId: id,
      meta: { title: mix.title },
    });

    return NextResponse.json(mix);
  } catch (error) {
    console.error("Mix update error:", error);
    return NextResponse.json({ error: "Failed to update mix" }, { status: 500 });
  }
}

// Admin: Delete mix
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
    const mix = await prisma.mix.delete({
      where: { id },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.DELETE,
      entityType: EntityTypes.MIX,
      entityId: id,
      meta: { title: mix.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mix delete error:", error);
    return NextResponse.json({ error: "Failed to delete mix" }, { status: 500 });
  }
}
