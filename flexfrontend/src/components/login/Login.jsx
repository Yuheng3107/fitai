import React, { useState, useEffect } from "react";
import {
  googleLogout,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import axios from "axios";

import { IonButton, IonImg } from "@ionic/react";

import googleIcon from "../../assets/svg/google-icon.svg";
import { backend } from "../../App";

function Login(props) {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  let csrftoken = null;

  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //     setUser(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("Login Failed");
  //   },
  // });

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

          fetch(`${backend}/users/data`, {
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
            props.setLoginStatus(true);
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
        <div className="flex flex-col items-center">
          <img
            className="rounded-full"
            src={profile.picture}
            alt="user image"
          />
          <IonButton
            className="dark:border-zinc-100 dark:border dark:text-zinc-50"
            onClick={() => logOut()}
          >
            Log out
          </IonButton>
        </div>
      ) : (
        <IonButton
          className="flex flex-row items-center dark:text-zinc-100 dark:border-zinc-100 text-base border border-gray-800 border-1"
          onClick={() => login()}
        >
          Sign in with Google{" "}
          <IonImg
            className="ml-2"
            src={googleIcon}
            alt="Google icon"
            width="20"
            height={20}
          ></IonImg>
        </IonButton>
      )}
    </div>
  );
}

export default Login;
