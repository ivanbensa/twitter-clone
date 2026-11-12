import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    console.log("Request to", request.url);

    return NextResponse.json({ ping: "pong" });
}