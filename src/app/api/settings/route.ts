import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { logAudit, AuditActions, EntityTypes } from "@/lib/audit";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  tagline: z.string().optional().nullable(),
  heroVideoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  heroImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  contactEmail: z.string().email().optional().or(z.literal("")).nullable(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    soundcloud: z.string().optional(),
    mixcloud: z.string().optional(),
    youtube: z.string().optional(),
    spotify: z.string().optional(),
  }).optional().nullable(),
  analyticsId: z.string().optional().nullable(),
  maintenanceMode: z.boolean().optional(),
  bookingEnabled: z.boolean().optional(),
});

// Public: Get site settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { slug: "main" },
    });

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// Admin: Update or create settings
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = settingsSchema.parse(body);

    const socialLinksValue = validated.socialLinks
      ? (validated.socialLinks as Prisma.InputJsonValue)
      : Prisma.JsonNull;

    const settings = await prisma.siteSettings.upsert({
      where: { slug: "main" },
      update: {
        siteName: validated.siteName,
        tagline: validated.tagline || null,
        heroVideoUrl: validated.heroVideoUrl || null,
        heroImageUrl: validated.heroImageUrl || null,
        contactEmail: validated.contactEmail || null,
        analyticsId: validated.analyticsId || null,
        maintenanceMode: validated.maintenanceMode ?? false,
        bookingEnabled: validated.bookingEnabled ?? true,
        socialLinks: socialLinksValue,
      },
      create: {
        slug: "main",
        siteName: validated.siteName,
        tagline: validated.tagline || null,
        heroVideoUrl: validated.heroVideoUrl || null,
        heroImageUrl: validated.heroImageUrl || null,
        contactEmail: validated.contactEmail || null,
        analyticsId: validated.analyticsId || null,
        maintenanceMode: validated.maintenanceMode ?? false,
        bookingEnabled: validated.bookingEnabled ?? true,
        socialLinks: socialLinksValue,
      },
    });

    await logAudit({
      actorId: session.user.id,
      action: AuditActions.UPDATE,
      entityType: EntityTypes.SETTINGS,
      entityId: settings.id,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
