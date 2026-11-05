

async function getTweet(id: string) {
    const res = await fetch(`https://dummyjson.com/posts/${id}`);
    return res.json();
}

export default async function TweetDetail({ params }: any) {
    const { id } = await params;
    const tweet = await getTweet(id);

    return (
        <main>
            <h1>{tweet.title}</h1>
            <p>{tweet.body}</p>
            <p>
                👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
            </p>
            <p>Tags: {tweet.tags.join(", ")}</p>
            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
                ← Back to Feed
            </a>
        </main>
    );
}