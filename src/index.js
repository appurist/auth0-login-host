import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
console.log("ClientID:", clientId);

// This is the path that handles redirection via ?deskReturnTo= after Auth0 returns.
const REDIRECT_PATH = "/go";
const redirectUri = window.location.origin + REDIRECT_PATH;

// This is the code that would need to be run on a /go (REDIRECT_PATH) page.
if (window.location.pathname === REDIRECT_PATH) {
  let returnTo = new URLSearchParams(window.location.search).get("deskReturnTo");
  if (returnTo) {
    console.log("/go is recognizing deskReturnTo:", returnTo);
    if (!returnTo.startsWith("http")) {
      returnTo = window.location.origin + returnTo;
    }
    window.location.assign(returnTo);
  }
}

// Now our React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// We need an onRedirectCallback function to handle the Auth0 redirect after login.
const onRedirectCallback = async (appState) => {
  if (appState?.target) {
    // e.g. coindesk.com/go?deskReturnTo=desiredPath
    const newTarget = window.location.origin + REDIRECT_PATH + "?deskReturnTo=" + appState.target;
    console.log(`onRedirectCallback: target="${newTarget}", appstate =`, JSON.stringify(appState, null, 2));
    // now we know where to go, so go there!
    window.history.replaceState({}, '', newTarget);
  }
};

// Make sure both redirectUri and onRedirectCallback are set below.
root.render(
  <React.StrictMode>
    <Auth0Provider domain={domain} clientId={clientId} redirectUri={redirectUri} onRedirectCallback={onRedirectCallback}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
