import { firestore, postToJSON } from 'firebaseInit';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

interface QueryOptions {
  qLimit?: number;
}

const collectionName = 'users';

/**`
 * Gets a users/{uid} document with username
 */
export async function getUserByUsername(username: string) {
  const usersRef = collection(firestore, collectionName);

  const q = query(usersRef, where('username', '==', username));
  const qSnapshot = await getDocs(q);

  let userDoc = null;

  qSnapshot.forEach((doc) => {
    userDoc = doc;
  });

  return userDoc;
}

/**`
 * Gets a users/{uid}/posts documents with username
 */
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
