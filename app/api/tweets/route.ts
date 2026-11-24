
import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

type Tweet = {
    id: string;
    text: string;
    createdAt: string;
};

const filePath = path.join(process.cwd(), "tweets.json");

async function readTweets(): Promise<Tweet[]> {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data) as Tweet[];
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }

        throw err;
    }
}

export async function GET() {
    const tweets = await readTweets();
    return NextResponse.json(tweets);
}

export async function POST(request: NextRequest) {
    const body: { text?: string } = await request.json();
    const text = body.text?.trim();

    if (!text || text.length > 280) {
        return NextResponse.json(
            { error: "Tweet must contain 1-280 characters" },
            { status: 400 }
        );
    }

    const tweets = await readTweets();

    const newTweet: Tweet = {
        id: randomUUID(),
        text,
        createdAt: new Date().toISOString(),
    };

    await fs.writeFile(
        filePath,
        JSON.stringify([newTweet, ...tweets], null, 2),
        "utf8"
    );

    return NextResponse.json(newTweet, { status: 201 });
}

