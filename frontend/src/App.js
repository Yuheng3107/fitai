import './App.css';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import Navbar from './component/navbar/Navbar';


function App() {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      console.log("useEffect is running");
      if (Object.keys(user).length) {
        console.log("user state has length")
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            console.log(res);
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    setProfile(null);
  }

  return (
    <div>
      <Navbar />
      <span className="text-2xl">testing tailwindCSS text</span>
      <main></main>
      <div>
        {Object.keys(profile).length ? (
          <div>
            <img src={profile.picture} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile.name}</p>
            <p>Email Address: {profile.email}</p>
            <br />
            <br />
            <button onClick={logOut}>Log out</button>
          </div>
        ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
        )}
      </div>
      {/* <div>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
        <p>Login State:<span className=''></span></p>
      </div> */}
    </div>
  );
}

export default App;
