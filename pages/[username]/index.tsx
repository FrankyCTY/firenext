import { firestore, postToJSON } from 'firebaseInit';
import UserProfileSection from 'components/UserProfileSection';
import PostFeed from 'components/PostFeed';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';

const getUserByUsername = async (username: string) => {
  const usersRef = collection(firestore, 'users');

  const q = query(usersRef, where('username', '==', username));
  const qSnapshot = await getDocs(q);

  let userDoc = null;

  qSnapshot.forEach((doc) => {
    userDoc = doc;
  });

  return userDoc;
};

interface QueryOptions {
  qLimit?: number;
}

export async function getUsersPosts(
  userDocPath: string,
  { qLimit = 5 }: QueryOptions = {}
) {
  const posts = [];

  const postsRef = collection(firestore, `${userDocPath}/posts`);

  const q = query(
    postsRef,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(qLimit)
  );
  const qSnapshot = await getDocs(q);

  qSnapshot.forEach((doc) => {
    posts.push(doc);
  });

  return posts;
}

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserByUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = {};
  let posts = [];

  if (userDoc) {
    user = userDoc.data();

    const userDocPath = userDoc.ref.path;
    const queriedPosts = await getUsersPosts(userDocPath);

    posts = queriedPosts.map((doc) => postToJSON(doc.data()));
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfileSection user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
