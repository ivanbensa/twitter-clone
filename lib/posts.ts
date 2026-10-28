export async function getPosts () {
    const response = await fetch('https://dummyjson.com/posts?limit=5');

    const data = await response.json();
    return data;
}