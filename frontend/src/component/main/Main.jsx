import React from "react";
import Webcam from "react-webcam";
import VideoFeed from "../webcam/video";
import expandIcon from "../../assets/svg/expand-icon.svg";

function Main() {
  return (
    <main>
      <VideoFeed />
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
      <button id="show-log-button">
        <span>Show Feedback Log</span>
        <img src={expandIcon} alt="expand icon" />
      </button>
      <ul id="feedback-list"></ul>
      <div id="start-button-group" className="flex">
        <button id="start-button" className="btn btn-success mt-3">
          Start Camera
        </button>
        <a className="btn btn-secondary mt-3" href="instructions">
          Instructions
        </a>
      </div>

      <form class="flex-row mt-3" id="changeExercise">
        <select class="form-select" name="exerciseId" id="changeExercise">
          <option selected value="0">
            Squat (Right Side)
          </option>
          <option value="1">Squat (Front)</option>
          <option value="2">Push-Up (Right Side)</option>
        </select>
        <input
          class="ms-2 btn btn-outline-info d-inline"
          type="submit"
          value="Start Exercise"
        />
      </form>
      <button id="end-button" class="btn btn-secondary">
        End Exercise
      </button>
      <div id="alerter"></div>
    </main>
  );
}

export default Main;
