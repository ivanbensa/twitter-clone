import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// PATCH /api/tweets/<id> with body { "type": "up" } or { "type": "down" }
type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
    await makeSureDbIsReady();

    const { id } = await params; // the <id> from the URL
    const { type }: { type?: string } = await request.json();

    // Which field should go up by one?
    const field =
        type === "up" ? "upvotes" : type === "down" ? "downvotes" : null;

    if (!field) {
        return Response.json(
            { error: 'type must be "up" or "down"' },
            { status: 400 }
        );
    }

    try {
        const tweet = await Tweet.findByIdAndUpdate(
            id,
            { $inc: { [field]: 1 } }, // "increase this field by 1"
            { new: true } // give me the tweet AFTER the update
        );

        if (!tweet) {
            return Response.json({ error: "Tweet not found" }, { status: 404 });
        }
        return Response.json(tweet);
    } catch (error) {
        // e.g. the id has an invalid format
        return Response.json({ error: "Invalid tweet id" }, { status: 400 });
    }
}

// DELETE /api/tweets/<id>
export async function DELETE(_request: Request, { params }: RouteContext) {
    await makeSureDbIsReady();

    const { id } = await params;
    try {
        const tweet = await Tweet.findByIdAndDelete(id);
        if (!tweet) {
            return Response.json({ error: "Tweet not found" }, { status: 404 });
        }
        return Response.json({ message: "Tweet deleted successfully" });
    } catch (error) {
        return Response.json({ error: "Invalid tweet id" }, { status: 400 });
    }
}