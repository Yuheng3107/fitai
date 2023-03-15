import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import './theme/tailwind.css';


//Google auth
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="908101547092-2cg5rblc0ppg7dvn8csk6l8p8ehc6crt.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode >

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
