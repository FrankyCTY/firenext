import Link from 'next/link';
import Img from 'next/image';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link passHref href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link passHref href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link passHref href={`/${username}`}>
                <Img
                  alt="user photo"
                  src={'/profile_pic.jpg'}
                  width="100%"
                  height="100%"
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link passHref href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
