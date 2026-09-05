import { NextResponse } from "next/server";
import { demoAttendance } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: demoAttendance,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Attendance session recorded successfully",
      sessionId: `att_${Date.now()}`,
      received: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
