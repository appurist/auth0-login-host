import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = `${window.location.origin}${window.location.pathname}`;

console.log("ClientID:", clientId);

const root = ReactDOM.createRoot(document.getElementById('root'));

const onRedirectCallback = async (appState) => {
  if (appState?.target) {
    // appState redirection support through Auth0    
    // const newTarget = "https://account-dev.coindesk.com/login?deskReturnTo=" + appState.target;
    const newTarget = window.location.origin + "/login?deskReturnTo=" + appState.target;
    console.log(`onRedirectCallback: target="${newTarget}", appstate =`, JSON.stringify(appState, null, 2));
    window.history.replaceState({}, '',  newTarget);
  }
};

root.render(
  <React.StrictMode>
    <Auth0Provider domain={domain} clientId={clientId} redirectUri={redirectUri} onRedirectCallback={onRedirectCallback}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
