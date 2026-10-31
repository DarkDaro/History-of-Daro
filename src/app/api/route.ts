import { NextResponse } from "next/server";

// В статическом экспорте (GitHub Pages) роут должен быть статическим.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}