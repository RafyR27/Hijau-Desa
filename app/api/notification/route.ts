// GET: /api/notifications?userId=1
// PATCH Body: { "id": 1 } atau { "userId": 1 }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.nextUrl.searchParams.get("userId"));

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid userId is required" },
        { status: 400 },
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("GET_NOTIF_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, userId } = await req.json();

    if (!id && !userId) {
      return NextResponse.json(
        { success: false, message: "Either 'id' or 'userId' is required" },
        { status: 400 },
      );
    }

    // Mark single notification as read (spesifik)
    if (id) {
      const data = await prisma.notification.update({
        where: { id: Number(id) },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, data });
    }

    // Mark all user notifications as read (semua userId)
    const result = await prisma.notification.updateMany({
      where: { userId: Number(userId), isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("PATCH_NOTIF_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
