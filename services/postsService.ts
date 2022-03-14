import { firestore } from 'firebaseInit';
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';

interface QueryOptions {
  qLimit?: number;
  createdAtCursor?: unknown;
}

const rootCollectionName = 'posts';

/**`
 * Gets a users/{uid}/posts documents with username
 */
export async function getPosts({
  qLimit = 5,
  createdAtCursor,
}: QueryOptions = {}) {
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
}

export async function createPost(userId = 'XsfP4t8XuiTk1t0a0Dot4lZfnHP2') {
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
}
