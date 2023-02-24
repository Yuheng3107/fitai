import React, { useState, useEffect } from "react";
import {
  googleLogout,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import Button from "../ui/Button";

function Login() {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  let csrftoken = null;

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
      setUser(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
    onNonOAuthError: (error) => {
      console.log("Non Auth Error");
      console.log(error);
    },
  });

  useEffect(() => {
    console.log("useEffect is running");
    if (Object.keys(user).length) {
      console.log("user object not empty");

      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setProfile(res.data);
          let last_name = res.data.family_name;
          let first_name = res.data.given_name;
          let email = res.data.email;

          fetch("http://localhost:8000/save_login_data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              last_name,
              first_name,
              email,
            }),
          }).then((response) => {
            // do something with response
            console.log(response);
          });
          // To use fetch API to send POST request to backend here
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      {Object.keys(profile).length ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={() => logOut()}>Log out</button>
        </div>
      ) : (
        <Button className="text-base border border-gray-800 border-1" onClick={() => login()}>Sign in with Google </Button>
      )}
    </div>
  );
}

export default Login;
