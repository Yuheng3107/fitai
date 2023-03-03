import Image from "next/image";

import React from "react";
import ReactDom from 'react-dom/client';
import App from "./App";
import reportWebVitals from "../utils/reportWebVitals";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function Home() {
    return <GoogleOAuthProvider clientId="908101547092-2cg5rblc0ppg7dvn8csk6l8p8ehc6crt.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default Home;