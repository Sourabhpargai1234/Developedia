import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession();
  console.log(authOptions);
  console.log("session: ", session);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authenticated", session });
}
