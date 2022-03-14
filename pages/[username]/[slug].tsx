import styles from 'styles/Post.module.css';
import PostContent from 'components/post/PostContent';
import { firestore, postToJSON } from 'firebaseInit';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ParsedUrlQuery } from 'querystring';
import Metatags from 'components/Metatag';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from 'userContext';
import AuthCheck from 'components/AuthCheck';
import HeartButton from 'components/HeartButton';

interface IParams extends ParsedUrlQuery {
  id: string;
  slug: string;
  username: string;
}

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

export async function getStaticProps({ params }: { params: IParams }) {
  const { username, slug } = params;
  const userDoc = await getUserByUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, userDoc.ref.path, 'posts', slug);
    const postDoc = await getDoc(postRef);
    post = postToJSON(postDoc.data());

    path = postDoc.ref.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const paths = [];
  // Improve my using Admin SDK to select empty docs
  const collectionGroupQuery = collectionGroup(firestore, 'posts');

  const q = query(collectionGroupQuery);

  const qSnapshot = await getDocs(q);

  qSnapshot.forEach((doc) => {
    const { slug, username } = doc.data();

    paths.push({
      params: {
        slug,
        username,
      },
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link passHref href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link passHref href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
