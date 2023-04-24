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


  //When the button is clicked, this function is triggered
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
    //This should trigger when the if the google login is completed, because the user state is now populated
    console.log("useEffect is running");
    if (Object.keys(user).length) {
      console.log("user object not empty");

      //Here, we query the google API to get the user's personal details: email, first name, last name, profile pic
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
          let last_name = res.data.family_name;
          let first_name = res.data.given_name;
          let email = res.data.email;
          let data = {
            last_name,
            first_name,
            email,
          };
          // Sends POST request to create user/ log user in
          fetch(`${backend}/users/user/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((response) => {
            console.log(response);
            props.setUpdateProfileState(props.updateProfileState + 1);
          })
          // To use fetch API to send POST request to backend here
        })
        .catch((err) => {
          console.log("there's an error at Login.jsx");
          console.log(err)
        });
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
          className="flex flex-row items-center
          dark:text-zinc-100 dark:border-zinc-100 text-base border border-gray-800 border-1"
          onClick={() => login()}
          color="light"
        >
          Sign in with Google{" "}
          <IonImg
            className="ml-2 h-6"
            src={googleIcon}
            alt="Google icon"
          ></IonImg>
        </IonButton>
      )}
    </div>
  );
}

export default Login;
