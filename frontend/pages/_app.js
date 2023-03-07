import '../styles/globals.css'


import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }) {
  return <GoogleOAuthProvider clientId="908101547092-2cg5rblc0ppg7dvn8csk6l8p8ehc6crt.apps.googleusercontent.com">
    <Component {...pageProps} />
  </GoogleOAuthProvider>
}

export default MyApp
