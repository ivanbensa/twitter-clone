function TweetCard({ post }: { post: any }) {
    return (
        <article>
            <p>{post.body}</p>
            <h2>{post.title}</h2>
        </article>
    )
}

export default TweetCard;