import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET(request: NextRequest) {
    console.log("Request to", request.url);

    try {
        const note = await fs.readFile(
            path.join(process.cwd(), "note.txt"),
            "utf8"
        );

        return NextResponse.json({ note });

    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        } else {
            throw err;
        }


    }
}

type CreateNoteBody = {
    text: string;
};

export async function POST(request: NextRequest) {
    const body: CreateNoteBody = await request.json();

    await fs.writeFile(
        path.join(process.cwd(), "note.txt"),
        body.text,
        { encoding: "utf8" }
    );

    return NextResponse.json({ ok: true });
}