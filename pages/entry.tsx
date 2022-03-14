import { auth as authInstance } from 'firebaseInit';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from 'userContext';
import UsernameForm from 'components/entry/UsernameForm';

const googleProvider = new GoogleAuthProvider();

export default function Entry(props) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      <h1>Sign up for this amazing app!</h1>

      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(authInstance, googleProvider)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} width="30px" /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => signOut(authInstance)}>Sign Out</button>;
}
