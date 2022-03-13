import { firestore } from 'firebaseInit';
import {
  collection,
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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
