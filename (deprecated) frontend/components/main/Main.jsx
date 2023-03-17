import React from "react";
import Webcam from "react-webcam";

import VideoFeed from "../webcam/video";
import Button from "../ui/Button";
import Select from "../ui/Select";
import expandIcon from "../../public/assets/svg/expand-icon.svg";

function Main() {
  
  const OAuthClientId = process.env.GOOGLE_OAUTH_ID;
  console.log(OAuthClientId);
  return (
    <main className='flex flex-col items-center bg-slate-800 text-white'>
      
      <VideoFeed />
      {/*
      <div id="rep-info-group">
        <span id="rep-count"></span>
        <p id="rep-feedback"></p>
      </div>
      <p id="main-feedback-group" className="text-center">
        <span id="main-feedback" className="text-center"></span>
      </p>
      <a
        id="feedback-button"
        className="btn btn-secondary"
        href="/errors"
        target="_blank"
      >
        About Errors
      </a>
      <p id="emotion-feedback"></p>
      <ul id="feedback-list"></ul>
      <div id="start-button-group" className="flex">
        <button id="start-button" className="btn btn-success mt-3">
          Start Camera
        </button>
        <a className="btn btn-secondary mt-3" href="instructions">
          Instructions
        </a>
      </div>

      <form className="flex-row mt-3" id="changeExercise">
        <Select defaultValue="0" className="form-select" name="exerciseId" id="changeExercise">
          <option  value="0">
            Squat (Right Side)
          </option>
          <option value="1">Squat (Front)</option>
          <option value="2">Push-Up (Right Side)</option>
        </Select>
        <input
          className="ms-2 btn btn-outline-info d-inline"
          type="submit"
          value="Start Exercise"
        />
      </form>
      <Button id="end-button" className="bg-sky-300">
        End Exercise
      </Button>
      <div id="alerter"></div>
      */}
    </main>
  );
}

export default Main;