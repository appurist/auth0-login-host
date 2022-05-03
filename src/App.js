import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

function App() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, handleRedirectCallback, logout } = useAuth0();

  useEffect (() => {
    if (!isLoading) {
      console.log("user is", user ? user : "not logged in");
    }
  }, [isLoading, user]);

  if (!isLoading) {
    if (window.location.search) {
      handleRedirectCallback().then(data => {
        const target = data?.appState?.target;
        console.log(`onRedirectCallback: data =`, JSON.stringify(data, null, 2));
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
    
  //const target = "https://account-dev.coindesk.com/login?deskReturnTo="+window.location.origin + window.location.pathname;
  // if (window.location.search) {
  //   target += window.location.search
  // }
  const doLogin = () => {
    const target = window.location.origin + window.location.pathname;
    loginWithRedirect({
      prompt: "select_account",
      appState: { target }
    });
  };

  const doLogout = () => {
    const target = window.location.origin + window.location.pathname;
    logout();
    window.location.assign(target);
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
