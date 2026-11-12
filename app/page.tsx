import { getPosts } from "@/lib/posts";
import TweetCard from "@/components/TweetCard";
import Link from "next/link";
import NoteForm from "@/components/NoteForm";

export default async function Home() {

    const data = await getPosts()
    return (
        <main>
            <h1>📝 Latest Tweets</h1>

            {data.posts.map((post: any) => (
                <Link key={post.id} href={`/tweet/${post.id}`}>
                    <TweetCard post={post}/>
                </Link>
            ))}

            <NoteForm />
        </main>
    );
}
