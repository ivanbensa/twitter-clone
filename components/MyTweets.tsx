
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Tweet = {
    id: string;
    text: string;
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
                body: JSON.stringify({ text }),
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
                    <article key={tweet.id} className="rounded border p-3">
                        <p className="whitespace-pre-wrap">{tweet.text}</p>
                        <small className="opacity-60">
                            {new Date(tweet.createdAt).toLocaleString()}
                        </small>
                    </article>
                ))}
            </div>
        </section>
    );
}
