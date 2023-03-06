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
      repCount: 0,
      repFeedback: "sample feedback for Rep 1",
      repFeedbackLog: "sample feedback for Rep 1. sample feedback for Rep 1. sample feedback for Rep 1",
      generalFeedback: "some stuff general feedback sample"
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
        <div className="mt-5">
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
        {/* <form className="flex flex-row items-center justify-center mt-3 " id="changeExercise">
          <Select className="form-select" name="exerciseId" id="changeExercise">
            <option selected value="0">
              Squat (Right Side)
            </option>
            <option value="1">Squat (Front)</option>
            <option value="2">Push-Up (Right Side)</option>
          </Select>
          <Button className=" dark:border dark:border-zinc-100"
            type="submit"
            value="Start Exercise">
            Start Exercise
          </Button>
        </form> */}
        <div className="exercise-feedback flex flex-col items-center p-5">
          <span className="flex flex-col justify-center items-center text-7xl pb-2 text-zinc-100 
          aspect-square w-1/2 border-8 border-sky-700 rounded-full">
            {this.state.repCount}
          </span>
          <TextBox className="bg-zinc-500 p-3 w-4/5 mt-3">{this.state.repFeedback}</TextBox>
          <TextBox className="bg-zinc-700 p-3 w-4/5 mt-1">{this.state.repFeedbackLog}</TextBox>
          <TextBox className="bg-zinc-500 p-3 w-4/5 mt-3">{this.state.generalFeedback}</TextBox>
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
    if (detector == undefined) {
      window.alert("loading!");
      return;
    }
    console.log("start");
    this.setState({
      repFeedback: "",
      generalFeedback: "Loading..."
    });

    //allow the feedback to update to loading
    await delay(1);

    // assign img height
    this.assignImgHeight();

    // reset local variables
    isActive = true;
    frameCount = 0;
    feedback = ["", ""];

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
    // await delay(3000);

    while (isActive) {
      let poses = await detector.estimatePoses(this.webcam.current.video);
      await delay(1);
      // process raw data
      let newFeedback = formCorrection.run(poses);
      if (newFeedback[0] !== "") {
        console.log(newFeedback[0][0]);
        this.setState({ repCount: newFeedback[0].slice(-1)[0].match(/\d+/)[0] });
        this.setState({ repFeedback: newFeedback[0].slice(-1) });
        this.setState({ repFeedbackLog: newFeedback[0] });
        read(newFeedback[0][newFeedback[0].slice(-1)]);
      }
      if (newFeedback[1] != feedback[1])
        this.setState({ generalFeedback: newFeedback[1] });
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
  if (x == 0) return {
    evalPoses: [new Float32Array([0, 0, 0, 0, 1.378, 0, 0, 0, 0.639, 0, 0])],
    scoreThreshold: 0.7,
    scoreDeviation: 0.02,
    angleWeights: new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, -1, 0, 0]),
    angleThresholds: [[
      new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2),
      new Float32Array([0.15, 0.15]),
      new Float32Array(2), new Float32Array(2), new Float32Array(2),
      new Float32Array([0.15, 0]),
      new Float32Array(2), new Float32Array(2),
    ]],
    minRepTime: 2000,
    glossary: [[
      ["", ""], ["", ""], ["", ""], ["", ""],
      ["Squat not low enough", "Squat too low"],
      ["", ""], ["", ""], ["", ""],
      ["Leaning forward too much", ""],
      ["", ""], ["", ""],
    ]]
  };
  if (x == 1) return {
    evalPoses: [new Float32Array([0, 0, 0, 0, 0, 2.466, 0, 2.430, 0, 0, 0]), new Float32Array(2), new Float32Array([0, 0, 0, 0, 0, 2.639, 0, 0, 0, 0, 0])],
    scoreThreshold: 0.9,
    scoreDeviation: 0.02,
    angleWeights: new Float32Array([0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]),
    angleThresholds: [[
      new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2),
      new Float32Array([0.2, 0]),
      new Float32Array(2),
      new Float32Array([0.25, 0.25]),
      new Float32Array(2), new Float32Array(2), new Float32Array(2),
    ], [], [
      new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2),
      new Float32Array([0, 0.1]),
      new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2),
    ]
    ],
    minRepTime: 2000,
    glossary: [[
      ["", ""], ["", ""], ["", ""], ["", ""], ["", ""],
      ["Knees collapse inwards but its mid rep", ""],
      ["", ""],
      ["Squat not low enough", "Squat too low"],
      ["", ""], ["", ""], ["", ""],
    ], [], [
      ["", ""], ["", ""], ["", ""], ["", ""], ["", ""],
      ["", "Knees collapse inwards"],
      ["", ""], ["", ""], ["", ""], ["", ""], ["", ""],
    ]
    ],
  };
  if (x == 2) return {
    evalPoses: [
      new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 1.702, 0, 1.650]),
    ],
    scoreThreshold: 0.6,
    scoreDeviation: 0.005,
    angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 10]),
    angleThresholds: [[
      new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2),
      new Float32Array([0, 0.1]),
      new Float32Array(2),
      new Float32Array([0.1, 0]),
    ],],
    minRepTime: 1500,
    glossary: [
      [
        ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""],
        ["", "Sagging back"],
        ["", ""],
        ["Not going low enough", ""],
      ]],
  };
}

export default VideoFeed;
