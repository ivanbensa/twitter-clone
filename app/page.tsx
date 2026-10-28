
import {getPosts} from "@/lib/posts";

export default async function Home() {

  const data = await getPosts()
  return (
    <main>
      <h1>Latest Tweets</h1>

      {data.posts.map((post: any) => (
          <article key={post.id}>
            <p>{post.body}</p>
            <h2>{post.title}</h2>
          </article>
      ))}
    </main>
  );
}
