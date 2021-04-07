import { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "aws-amplify";
import { listPosts } from "../graphql/queries";
import fetch from "isomorphic-unfetch";

export default function Home() {
  async function getInitialProps() {
    const res = await fetch(
      "https://api.typeform.com/oauth/authorize?state=xyz789&client_id=3G7z6PvD6g44Phd5wAJfkcVdbL9deG8AQbiXhkyCDpAY&redirect_uri=https://google.com"
    );
    const token = await res.json();
    return { token };
  }
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
    getInitialProps();
  }, []);
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    });
    setPosts(postData.data.listPosts.items);
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
