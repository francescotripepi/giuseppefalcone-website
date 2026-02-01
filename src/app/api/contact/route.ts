import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";

// Public: Submit contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactMessageSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json({ success: true, id: message.id }, { status: 201 });
  } catch (error) {
    console.error("Contact message error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Admin: Get contact messages
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const where = unreadOnly ? { isRead: false } : {};

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
