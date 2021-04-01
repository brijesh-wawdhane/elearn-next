import "../styles/globals.css";
import "../configureAmplify";
import Link from "next/link";
import { Auth } from "aws-amplify";

function MyApp({ Component, pageProps }) {
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

  if (status) {
    return (
      <div>
        <nav className="p-6 border-b border-gray-300">
          <Link href="/">
            <span className="mr-6 cursor-pointer">Home</span>
          </Link>
          <Link href="/profile">
            <span className="mr-6 cursor-pointer">Profile</span>
          </Link>
        </nav>
        <div className="py-8 px-16">
          <Component {...pageProps} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="p-6 border-b border-gray-300">
        <Link href="/">
          <span className="mr-6 cursor-pointer">Home</span>
        </Link>
        <Link href="/create-post">
          <span className="mr-6 cursor-pointer">Create Post</span>
        </Link>
        <Link href="/profile">
          <span className="mr-6 cursor-pointer">Profile</span>
        </Link>
      </nav>
      <div className="py-8 px-16">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
