"use client";

import { useState } from "react";

export default function NoteForm() {
    const [text, setText] = useState<string>("");

    async function sendNote() {
        const response = await fetch("/api/hello", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text }),
        });

        const data = await response.json();
        console.log(data);
    }

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write something..."
            />

            <button onClick={sendNote}>Send</button>
        </div>
    );
}