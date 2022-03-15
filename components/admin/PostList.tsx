import PostFeed from 'components/PostFeed';
import { collection, orderBy, query } from 'firebase/firestore';
import { firestore, auth } from 'firebaseInit';
import { useCollection } from 'react-firebase-hooks/firestore';

const PostList = () => {
  const postRef = collection(firestore, `users/${auth.currentUser.uid}/posts`);
  const q = query(postRef, orderBy('createdAt'));

  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

export default PostList;
