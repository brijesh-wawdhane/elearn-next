import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useRouter } from "next/router";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "../../graphql/mutations";
import { getPost } from "../../graphql/queries";
import Head from "next/head";
import axios from "axios";

function EditPost() {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const postData = await API.graphql({ query: getPost, variables: { id } });
      setPost(postData.data.getPost);
    }
  }, [id]);
  if (!post) return null;
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }
  const { title, videoUrl, content } = post;
  async function updateCurrentPost() {
    if (!title || !videoUrl || !content) return;
    await API.graphql({
      query: updatePost,
      variables: { input: { title, videoUrl, content, id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    console.log("post successfully updated!");
    router.push("/my-posts");
  }

  state = {
    token: [],
  };

  const api = axios.create({
    baseURL: `https://api.typeform.com/`,
  });

  getToken = async () => {
    let data = await api
      .get("/oauth/authorize", {
        client_id: "3G7z6PvD6g44Phd5wAJfkcVdbL9deG8AQbiXhkyCDpAY",
        redirect_uri: "https://dye9ikgpsq2ey.cloudfront.net/",
      })
      .then(({ data }) => data);
    this.setState({ courses: data });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Edit post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <input
        onChange={onChange}
        name="videoUrl"
        placeholder="Video URL"
        value={post.videoUrl}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}
      >
        Update Post
      </button>
      <button className="m-8 bg-green-500 text-white font-semibold px-8 py-2 rounded-lg">
        Create test
      </button>
    </div>
  );
}

export default EditPost;
