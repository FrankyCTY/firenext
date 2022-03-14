import { doc, Timestamp, setDoc } from 'firebase/firestore';
import { firestore, postToJSON } from 'firebaseInit';
import { useState } from 'react';
import Loader from 'components/Loader';
import PostFeed from 'components/PostFeed';
import { createPost, getPosts } from 'services/postsService';

// Max post to query per page
const qLimit = 1;

export async function getServerSideProps() {
  const posts = [];

  const postDocs = await getPosts({ qLimit });

  postDocs.forEach((doc) => {
    posts.push(postToJSON(doc.data()));
  });

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostsEnd, setIsPostsEnd] = useState(false);

  const getMorePosts = async () => {
    console.log('asdkjabskdhbahjsbd');
    setIsLoading(true);
    const lastLoadedPost = posts[posts.length - 1];

    const newPosts = [];

    // Transform number to firestore timestamp if needed
    const cursor =
      typeof lastLoadedPost.createdAt === 'number'
        ? Timestamp.fromMillis(lastLoadedPost.createdAt)
        : lastLoadedPost.createdAt;

    const postDocs = await getPosts({ qLimit, createdAtCursor: cursor });

    postDocs.forEach((doc) => {
      posts.push(postToJSON(doc.data()));
    });

    setPosts(posts.concat(newPosts));
    setIsLoading(false);

    if (newPosts.length < qLimit) {
      setIsPostsEnd(true);
    }
  };

  return (
    <main>
      <button
        onClick={async () => {
          await createPost();
        }}
      >
        Add post
      </button>
      <PostFeed posts={posts} />

      {!isLoading && !isPostsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={isLoading} />

      {isPostsEnd && 'You have reached the end!'}
    </main>
  );
}
