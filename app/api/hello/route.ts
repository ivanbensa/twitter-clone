import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    console.log("Request to", request.url);

    return NextResponse.json({ ping: "pong" });
}

type CreateNoteBody = {
    text: string;
};

export async function POST(request: NextRequest) {
    const body: CreateNoteBody = await request.json();

    console.log(body.text);

    return NextResponse.json({ ok: true });
}