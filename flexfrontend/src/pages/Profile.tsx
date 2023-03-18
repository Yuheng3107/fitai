import React, { useState, useEffect, useRef } from "react";

import checkLoginStatus from "../utils/checkLogin";
import getProfileData from "../utils/getProfileData";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/react";
import Login from "../components/login/Login";
import { backend } from "../App";

const Tab3: React.FC = () => {
  const endpoint = `${backend}/users/user/update`;
  const [loginStatus, setLoginStatus] = useState(false);
  const [profileData, setProfileData] = useState({});

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [filePath, setFilePath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);

    if (loginStatus && !Object.keys(profileData).length) {
      getProfileData(setProfileData);
    }
  }, [
    loginStatus,
    setLoginStatus,
    checkLoginStatus,
    getProfileData,
    setProfileData,
    profileData,
  ]);

  function createUserHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fileInput = fileInputRef.current?.files?.[0];
    if (!fileInput) {
      console.log("no file input");
      return;
    }
    let profilePhotoFormData = new FormData();
    profilePhotoFormData.append("photo", fileInput);

    interface Data {
      email?: string;
      privacy_level?: number;
      username?: string;
    }
    let data: Data = {};
    if (emailInput !== "") {
      data["email"] = emailInput;
    }
    if (usernameInput !== "") {
      data["username"] = usernameInput;
    }

    console.log(fileInput);

    fetch(`${backend}/users/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(
          document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
        ),
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((response) => {
      // do something with response
      console.log(response);
    });
    fetch(`${backend}/users/user/update/profile_photo`, {
      method: "POST",
      headers: {
        "X-CSRFToken": String(
          document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
        ),
      },
      credentials: "include",
      body: profilePhotoFormData,
    }).then((response) => {
      // do something with response
      console.log(response);
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonTitle size="large">Tab 3</IonTitle>
        <div>
          Login Here
          <Login setLoginStatus={setLoginStatus} />
        </div>
        <div>
          <h1>Create User</h1>
          <form onSubmit={createUserHandler}>
            <label htmlFor="profilePhoto">Upload Profile Photo</label>
            <input
              ref={fileInputRef}
              onChange={(e) => {
                setFilePath(e.target.value);
                console.log(e.target.value);
              }}
              className="border border-neutral-500"
              type="file"
              name="profilePhoto"
            />

            <div>
              <label htmlFor="username">Username</label>
              <input
                onChange={(e) => setUsernameInput(e.target.value)}
                className="border border-neutral-500"
                type="text"
                name="username"
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmailInput(e.target.value)}
                className="border border-neutral-500"
                type="email"
                name="email"
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                className="border border-neutral-500"
                type="password"
                name="password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="border border-neutral-500"
                type="password"
                name="confirmPassword"
              />
            </div>

            <input className="border border-neutral-500" type="submit" />
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
