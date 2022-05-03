import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

// This is the place Auth0 redirects to after logout (in this case).
const REDIRECT_PATH = "/go";

function App() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, handleRedirectCallback, logout } = useAuth0();

  useEffect (() => {
    if (!isLoading) {
      if (user) {
        console.log(`user is ${user.name}`, user);
      } else {
        console.log("user is not logged in");
      }
    }
  }, [isLoading, user]);

  // Check if there's a deskReturnTo parameter in the URL.
  let deskReturnTo = new URLSearchParams(window.location.search).get("deskReturnTo");
  if (deskReturnTo) {
    console.log("Recognizing deskReturnTo:", deskReturnTo);
    if (!deskReturnTo.startsWith("http")) {
      deskReturnTo = window.location.origin + deskReturnTo;
    }
    window.location.assign(deskReturnTo);
    return;
  }

  if (!isLoading) {
    // Check to see if this is a redirect from Auth0 and let it take care of it.
    let state = new URLSearchParams(window.location.search).get("state");
    if (state) {  // state is set by Auth0 after login
      // Let Auth0 process the state and code parameters.
      handleRedirectCallback().then(data => {
        // This gives us our appState data.
        const target = data?.appState?.target;
        // console.log(`onRedirectCallback: data =`, JSON.stringify(data, null, 2));
        if (target) {
          window.location.assign(target);
        }
      }).catch(error => {
        if (error.message === "Invalid state") {  
          console.log("Invalid state: Auth0 redirect was blocked due to cross-domain state.");
        } else {
          console.log("handleRedirectCallback: error =", error);
        }
      });
    }
  }
    
  const doLogin = () => {
    const target = window.location.origin + window.location.pathname;
    // Store our desired path in the appState 'target' field for the block of code above.
    loginWithRedirect({
      prompt: "select_account",
      appState: { target }
    });
  };

  const doLogout = () => {
    const target = window.location.origin + window.location.pathname;
    const returnTo = window.location.origin + REDIRECT_PATH + "?deskReturnTo=" + target;
    // Logout but specify a redirect URL with our desired path.
    logout({returnTo});
  };

  // console.log("rendering page");
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Login Page
        </h1>
      </header>

      <section>
        <div>Auth0 Loading: {isLoading ? "TRUE" : "FALSE"}</div>
        <div>Authenticated: {isAuthenticated ? "TRUE" : "FALSE"}</div>
        {isAuthenticated && (<>
          <p>Name: {user.name}</p>
        </>)}
        {!isAuthenticated && (<>
          <p>Not logged in.</p>
        </>)}

        {isLoading ? <div>Loading...</div> : 
        <>
          {isAuthenticated && 
            (
            <button onClick={() => doLogout()}>Log out</button>
            )
          }
          {!isAuthenticated && 
            (
            <button onClick={() => doLogin()}>Log in</button>
            )
          }
        </>
      }
      </section>
    </div>
  );
}

export default App;
