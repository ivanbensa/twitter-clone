
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Tweet = {
    _id: string;
    content: string;
    author: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
};

export default function MyTweets() {
    const [text, setText] = useState("");
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadTweets() {
            try {
                const response = await fetch("/api/tweets");

                if (!response.ok) {
                    throw new Error("Could not load tweets");
                }

                const data: Tweet[] = await response.json();
                setTweets(data);
            } catch {
                setError("Could not load tweets");
            }
        }

        loadTweets();
    }, []);

    async function createTweet(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!text.trim()) return;

        setSaving(true);
        setError("");

        try {
            const response = await fetch("/api/tweets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: text }),
            });

            if (!response.ok) {
                throw new Error("Could not save tweet");
            }

            const newTweet: Tweet = await response.json();

            setTweets((previous) => [newTweet, ...previous]);
            setText("");
        } catch {
            setError("Could not save tweet");
        } finally {
            setSaving(false);
        }
    }

    async function voteTweet(id: string, type: "up" | "down") {
        try {
            const response = await fetch(`/api/tweets/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type }),
            });

            if (!response.ok) {
                throw new Error("Could not vote");
            }

            const updatedTweet: Tweet = await response.json();

            setTweets((previous) =>
                previous.map((tweet) =>
                    tweet._id === id ? updatedTweet : tweet
                )
            );
        } catch {
            setError("Could not vote");
        }
    }

    return (
        <section className="my-6 rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-bold">My Tweets</h2>

            <form onSubmit={createTweet} className="space-y-3">
        <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What's happening?"
            maxLength={280}
            className="w-full rounded border bg-white p-3 text-black"
        />

                <button
                    type="submit"
                    disabled={saving || !text.trim()}
                    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Tweet"}
                </button>
            </form>

            {error && <p className="mt-3 text-red-500">{error}</p>}

            <div className="mt-5 space-y-3">
                {tweets.map((tweet) => (
                    <article key={tweet._id} className="rounded border p-3">
                        <p className="whitespace-pre-wrap">{tweet.content}</p>
                        <small className="opacity-60">
                            {new Date(tweet.createdAt).toLocaleString()}
                        </small>

                        <div className="mt-3 flex gap-4">
                            <button
                                type="button"
                                onClick={() => voteTweet(tweet._id, "up")}
                                className="rounded border px-3 py-1"
                            >
                                👍 {tweet.upvotes}
                            </button>

                            <button
                                type="button"
                                onClick={() => voteTweet(tweet._id, "down")}
                                className="rounded border px-3 py-1"
                            >
                                👎 {tweet.downvotes}
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
