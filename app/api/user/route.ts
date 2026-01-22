import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(null, { status: 401 });
    }
    
    return NextResponse.json(session.user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(null, { status: 401 });
  }
}
