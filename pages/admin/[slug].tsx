import { useState } from 'react';
import { useRouter } from 'next/router';

import AuthCheck from 'components/AuthCheck';
import PostForm from 'components/admin/editPost/PostForm';
import { doc } from 'firebase/firestore';
import { firestore, auth } from 'firebaseInit';
import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import styles from 'styles/Admin.module.css';

function AdminPostEdit({ Component, pageProps }) {
  const [preview, setPreview] = useState(false);

  const exitEditMode = () => {
    setPreview(true);
  };

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    firestore,
    `users/${auth.currentUser?.uid}/posts/${slug}`
  );
  const [post] = useDocumentData(postRef);

  if (!auth?.currentUser) {
    return <h2>Loading</h2>;
  }

  return (
    <AuthCheck>
      <main className={styles.container}>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>

              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
                exitEditMode={exitEditMode}
              />
            </section>

            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>
                {preview ? 'Edit' : 'Preview'}
              </button>

              <Link passHref href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
            </aside>
          </>
        )}
      </main>
    </AuthCheck>
  );
}

export default AdminPostEdit;
