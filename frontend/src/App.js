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
        console.log("user object not empty");

        axios.post(
          "http://localhost:8000/rest-auth/google/",
          {
            access_token: user.access_token,
          }
        )
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err);
          });
        // axios
        //   .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        //     headers: {
        //       Authorization: `Bearer ${user.access_token}`,
        //       Accept: 'application/json'
        //     }
        //   })
        //   .then((res) => {
        //     console.log(res);
        //     setProfile(res.data);
        //   })
        //   .catch((err) => console.log(err));
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
      <span classNameName="text-2xl">testing tailwindCSS text</span>
      <main>
        <canvas id="canvas" className="hidden"></canvas>
        <video id="video" className="video-feed" autoplay playsinline alt="Video"></video>
        <div id="rep-info-group">
          <span id="rep-count"></span>
          <p id="rep-feedback"></p>
        </div>
        <p id="main-feedback-group" className="text-center">
          <span id="main-feedback" className="text-center"></span>
        </p>
        <a id="feedback-button" className="btn btn-secondary" href="/errors" target="_blank">About Errors</a>
        <p id="emotion-feedback"></p>
        <button id="show-log-button">
          <span>Show Feedback Log</span>
          <img src="../assets/svg/expand-icon.svg" alt="expand icon" />
        </button>
        <ul id="feedback-list"></ul>
        <div id="start-button-group" className="flex">
          <button id="start-button" className="btn btn-success mt-3">Start Camera</button>
          <a className="btn btn-secondary mt-3" href="instructions">Instructions</a>
        </div>

        <form class="flex-row mt-3" id="changeExercise">
          <select class="form-select" name="exerciseId" id="changeExercise">
            <option selected value="0">Squat (Right Side)</option>
            <option value="1">Squat (Front)</option>
            <option value="2">Push-Up (Right Side)</option>
          </select>
          <input class="ms-2 btn btn-outline-info d-inline" type="submit" value="Start Exercise" />
        </form>
        <button id="end-button" class="btn btn-secondary">End Exercise</button>
        <div id="alerter"></div>
      </main>


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
        <p>Login State:<span classNameName=''></span></p>
      </div> */}
    </div>
  );
}

export default App;
