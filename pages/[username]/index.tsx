import { postToJSON } from 'firebaseInit';
import UserProfileSection from 'components/UserProfileSection';
import PostFeed from 'components/PostFeed';
import { getUsersPosts, getUserByUsername } from 'services/usersService';

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserByUsername(username);

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
