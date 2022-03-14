import {
  doc,
  Timestamp,
  setDoc,
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { firestore, postToJSON } from 'firebaseInit';
import { useState } from 'react';
import Loader from 'components/Loader';
import PostFeed from 'components/PostFeed';

// Max post to query per page
const qLimit = 1;
interface QueryOptions {
  qLimit?: number;
  createdAtCursor?: unknown;
}

const createPost = async (userId = 'XsfP4t8XuiTk1t0a0Dot4lZfnHP2') => {
  await setDoc(doc(firestore, 'users', userId, 'posts', 'hello-world'), {
    content: '# Hello world',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    slug: 'hello-world',
    title: 'Hello world',
    uid: userId,
    username: 'franky',
    heartCount: 10,
    published: true,
  });
};

const getPublishedPosts = async ({
  qLimit = 5,
  createdAtCursor,
}: QueryOptions = {}) => {
  const postDocs = [];
  const collectionGroupQuery = collectionGroup(firestore, 'posts');

  let q;

  if (createdAtCursor) {
    q = query(
      collectionGroupQuery,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(createdAtCursor),
      limit(qLimit)
    );
  } else {
    q = query(
      collectionGroupQuery,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(qLimit)
    );
  }

  const qSnapshot = await getDocs(q);

  qSnapshot.forEach((doc) => {
    postDocs.push(doc);
  });

  return postDocs;
};

export async function getServerSideProps() {
  const posts = [];

  const postDocs = await getPublishedPosts({ qLimit });

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
    setIsLoading(true);
    const lastLoadedPost = posts[posts.length - 1];

    const newPosts = [];

    // Transform number to firestore timestamp if needed
    const cursor =
      typeof lastLoadedPost.createdAt === 'number'
        ? Timestamp.fromMillis(lastLoadedPost.createdAt)
        : lastLoadedPost.createdAt;

    const postDocs = await getPublishedPosts({
      qLimit,
      createdAtCursor: cursor,
    });

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
      {/* <button
        onClick={async () => {
          await createPost();
        }}
      >
        Add post
      </button> */}
      <PostFeed posts={posts} />

      {!isLoading && !isPostsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={isLoading} />

      {isPostsEnd && 'You have reached the end!'}
    </main>
  );
}
