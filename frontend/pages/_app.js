import '../styles/globals.css'


import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps, oAuthClientId }) {
  console.log(oAuthClientId);
  return <GoogleOAuthProvider clientId={oAuthClientId}>
    <Component {...pageProps} />
  </GoogleOAuthProvider>
}

MyApp.getInitialProps =  (ctx) => {
  const oAuthClientId = process.env.GOOGLE_OAUTH_ID;
  // const appInitialProps = App.getInitialProps(appContext);
  return {oAuthClientId };
}

export default MyApp
