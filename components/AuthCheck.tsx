import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from 'userContext';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/entry">You must be signed in</Link>;
}
