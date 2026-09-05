import { NextResponse } from "next/server";
import { demoNotifications } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: demoNotifications,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Notification dispatched",
      id: `notif_${Date.now()}`,
      notification: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
