import { OverviewConfig } from '../features/flow/components/overview-config';
import { useAuth, useLoginWithRedirect } from '@frontegg/react';

export function RootPage() {
  // useAuth hook to check if the current user is signed in, returning the user object if so
  const { user, isAuthenticated } = useAuth();
  // trigger the sign-in flow with automatic redirect
  // this allows the use of the login hook in a callback, like in the onClick event trigger of our login button
  const loginWithRedirect = useLoginWithRedirect();
  // log the user out and try to return to current page (unauthenticated)
  const logout = () => {
    window.location.href = `${
      import.meta.env.VITE_FRONTEGG_BASE_URL
    }/oauth/logout?post_logout_redirect_uri=${window.location.href}`;
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 bg-gray-50">
        <OverviewConfig />
      </div>

      {/**
       * If the user is authenticated, show a logout button and the current user's email, else
       * show a login button which redirects to the login page
       **/}
      {isAuthenticated ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <p>
            You've successfully logged in with
            <br />
            {user?.email}!
          </p>
        </>
      ) : (
        <>
          <button onClick={() => loginWithRedirect()}>Login</button>

          <a
            href="https://developers.frontegg.com/guides/getting-started/home"
            target="_blank"
            rel="noreferrer"
          >
            <p>Add Authentication with Frontegg</p>
          </a>
        </>
      )}
    </main>
  );
}
