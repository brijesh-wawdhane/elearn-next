import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createPost } from "../graphql/mutations";
import { Auth } from "aws-amplify";

const initialState = { videoUrl: "", title: "", content: "" };

function CreatePost() {
  const [post, setPost] = useState(initialState);
  const { title, videoUrl, content } = post;
  const router = useRouter();
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }
  async function createNewPost() {
    if (!videoUrl || !title || !content) return;
    const id = uuid();
    post.id = id;

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    router.push(`/posts/${id}`);
  }
  var seen = [];
  let authdata = JSON.stringify(Auth, function (key, val) {
    if (val != null && typeof val == "object") {
      if (seen.indexOf(val) >= 0) {
        return;
      }
      seen.push(val);
    }
    return val;
  });
  let stringifiedauthdata = JSON.stringify(authdata);

  var status = new RegExp("student").test(stringifiedauthdata);
  console.log(status);

  if (status) {
    return (
      <h1 className="text-3xl text-red-600 font-semibold tracking-wide mt-6">
        You are not authorized
      </h1>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new post
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
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPost}
      >
        Create Post
      </button>
    </div>
  );
}

export default withAuthenticator(CreatePost);
