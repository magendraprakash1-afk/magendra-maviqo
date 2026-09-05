import { NextResponse } from "next/server";
import { demoPendingAssignments } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: demoPendingAssignments,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Assignment created successfully",
      id: `asg_${Date.now()}`,
      assignment: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
