import React, { Component, useEffect } from "react";
import { isMobile, isSafari, isFirefox } from "react-device-detect";
import Webcam from "react-webcam";

//components
import Button from "../ui/Button";
import TextBox from "../ui/TextBox";
import Select from "../ui/Select";

//MoveNet
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

//formCorrection
import * as formCorrection from "../../utils/formCorrection.js";

let feedback = new Array();
let isActive = false;
let frameCount = 0;
let detector;
let synth;

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repFeedback: 0,
      generalFeedback: 0
    };

    this.webcam = React.createRef();
    this.image = React.createRef();
  }

  componentDidMount = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
  };

  render = () => {
    return (
      <React.Fragment>
        <Webcam videoConstraints={{ facingMode: "user" }} ref={this.webcam} />
        <div>
          <Button
            onClick={() => this.start()}
            className="bg-green-300 w-16 mx-2 text-zinc-900 
            dark:bg-lime-700 dark:hover:bg-lime-500 dark:text-zinc-100"
          >
            Start
          </Button>
          <Button
            onClick={() => this.end()}
            className="bg-amber-200 w-16 mx-2 text-zinc-900 
          dark:bg-yellow-600 dark:hover:bg-amber-500 dark:text-zinc-100 "
          >
            End
          </Button>
        </div>
        <form className="flex-row mt-3" id="changeExercise">
          <Select className="form-select" name="exerciseId" id="changeExercise">
            <option selected value="0">
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
        <div>
          <TextBox text={this.state.repFeedback} />
          <TextBox text={this.state.generalFeedback} />
        </div>
        <img src="" alt="" ref={this.image} />
      </React.Fragment>
    );
  };

  /*--------------------
  MOVENET METHODS
  --------------------*/

  /**
   * Starts Exercise
   */
  start = async () => {
    console.log("start");

    // assign img height
    this.assignImgHeight();

    // reset local variables
    isActive = true;
    frameCount = 0;
    feedback = ["", ""];
    this.setState({
      repFeedback: "",
      generalFeedback: "Loading..."
    });

    // get from backend
    let exercise = getExercise(0);

    // initialise form correction
    formCorrection.init(
      exercise.evalPoses,
      exercise.scoreThreshold,
      exercise.scoreDeviation,
      exercise.angleWeights,
      exercise.angleThresholds,
      exercise.minRepTime,
      exercise.glossary
    );

    // wait 3s before starting exercise
    await delay(3000);

    while (isActive) {
      let poses = await detector.estimatePoses(this.webcam.current.video);
      await delay(1);
      // process raw data
      let newFeedback = formCorrection.run(poses);
      if (newFeedback[0] != "") {
        this.setState({repFeedback: newFeedback[0]});
        read(newFeedback[0][newFeedback[0].length-1]);
      }
      if (newFeedback[1] != feedback[1])
        this.setState({generalFeedback: newFeedback[1]});
      feedback = newFeedback;
      frameCount += 1;

      /*
      fetch("http://localhost:8000/live_exercise/handle_key_points/", {
        method: "POST",
        credentials: "include", // include cookies in the request
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
        },
        body: JSON.stringify(),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      */
    }
  };

  /**
   * Ends Exercise
   */
  end = () => {
    isActive = false;
    console.log("End");
    let feedback = formCorrection.endExercise();
    this.setState({
      repFeedback: feedback,
      generalFeedback: frameCount
    })
  };

  assignImgHeight = () => {
    let screenshot = this.webcam.current.getScreenshot();
    this.image.current.src = screenshot;
    let img = new Image();
    img.src = screenshot;
    img.onload = () => {
      // window.alert(`Width is ${img.width}, Height is ${img.height}`);
      // Changes height and width of video in Webcam component

      // set explicit width and height for video
      [this.webcam.current.video.width, this.webcam.current.video.height] = [
        img.width,
        img.height,
      ];
    };
  };
}

/*--------------------
HELPER FUNCTIONS
--------------------*/
async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

const read = (content) => {
  if (textToSpeech()) {
    let speech = new SpeechSynthesisUtterance(content);
    synth.speak(speech);
  }
  // can enable error to pop up if no text to speech
};

const textToSpeech = () => {
  if ("speechSynthesis" in window) {
    synth = window.speechSynthesis;
    return true;
  }
  return false;
};

/**
 * To be replaced with request to backend.
 * @param {Object} x
 * @returns Exercise Parameters
 */
function getExercise(x) {
  if (x == 0)
    return {
      evalPoses: [new Float32Array([0, 0, 0, 0, 1.05, 0, 0, 0, 0.7, 0, 0])],
      scoreThreshold: 0.7,
      scoreDeviation: 0.02,
      angleWeights: new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0]),
      angleThresholds: [
        [
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array([0.14, 0.13]),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array([0.15, 0]),
          new Float32Array(2),
          new Float32Array(2),
        ],
      ],
      minRepTime: 2000,
      glossary: [
        [
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["Squat not low enough", "Squat too low"],
          ["", ""],
          ["", ""],
          ["", ""],
          ["Leaning forward too much", ""],
          ["", ""],
          ["", ""],
        ],
      ],
    };
  if (x == 1)
    return {
      evalPoses: [new Float32Array([0, 0, 0, 0, 0, 2.375, 0, 2.25, 0, 0, 0])],
      scoreThreshold: 0.7,
      scoreDeviation: 0.02,
      angleWeights: new Float32Array([0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]),
      angleThresholds: [
        [
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array([0.26, 0]),
          new Float32Array(2),
          new Float32Array([0.3, 0.2]),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
        ],
      ],
      minRepTime: 2000,
      glossary: [
        [
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["Knees collapse inwards", ""],
          ["", ""],
          ["Squat not low enough", "Squat too low"],
          ["", ""],
          ["", ""],
          ["", ""],
        ],
      ],
    };
  if (x == 2)
    return {
      evalPoses: [
        new Float32Array([0, 0, 0, 0, 2.825, 0, 2.832, 0, 1.583, 0, 1.7]),
      ],
      scoreThreshold: 0.7,
      scoreDeviation: 0.02,
      angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 10]),
      angleThresholds: [
        [
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array(2),
          new Float32Array([0, 0.23]),
          new Float32Array(2),
          new Float32Array([0.3, 0]),
        ],
      ],
      minRepTime: 1500,
      glossary: [
        [
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", ""],
          ["", "Sagging back"],
          ["", ""],
          ["Not going low enough", ""],
        ],
      ],
    };
}

export default VideoFeed;
