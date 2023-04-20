import React, { Component } from "react";
import { isMobile, isSafari, isFirefox } from "react-device-detect";
import Webcam from "react-webcam";

//ionic imports
import { IonSpinner } from "@ionic/react";

//components
import Button from "../ui/Button";
import TextBox from "../ui/TextBox";
import StartEndButton from "./StartEndButton";

//assets
import expandIcon from "../../assets/svg/expand-icon.svg";
import PlayIcon from "../../assets/svgComponents/playIcon";
import StopIcon from "../../assets/svgComponents/stopIcon";

//MoveNet
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

//formCorrection
import * as formCorrection from "../../utils/formCorrection";
import getExercise from "../../utils/ExerciseAlgo/exericseAlgo";
import RepCountCircle from "./RepCountCircle";

let feedback = new Array();
let isActive = false;
let frameCount = 0;
let synth;

class VideoFeed extends Component {
  constructor(props) {
    super(props);

    this.setState = this.setState.bind(this); // <- try by adding this line

    this.state = {
      //Movenet model
      detectorLoading: true,
      detector: {},
      repCount: 0,
      perfectRepCount: 0,
      repFeedback: "",
      repFeedbackLog: "",
      generalFeedback: "",
      feedbackLogShowing: false,
      startButton: true,
      offset: 0,
      percentage: 0,
    };

    this.webcam = React.createRef();
    this.toggleFeedbackLog = this.toggleFeedbackLog.bind(this);
  }

  componentDidMount = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    let detectorObject = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    this.setState({
      detector: detectorObject,
      detectorLoading: false
    })
  };

  toggleFeedbackLog() {
    this.setState((prevState) => {
      console.log(prevState.feedbackLogShowing);
      return { feedbackLogShowing: !prevState.feedbackLogShowing };
    });
  }

  render = () => {
    return (
      <div className="relative h-full">
        <Webcam videoConstraints={{ facingMode: "user" }} ref={this.webcam} />
        <div className="exercise-feedback flex flex-col items-center p-5 w-full">

          <RepCountCircle repCount={this.state.repCount} repCountInput={this.props.repCountInput} />

          <TextBox className="flex flex-col justify-between bg-zinc-100 pt-3 pb-0 w-4/5 mt-3">
            {this.state.feedbackLogShowing}
            {this.state.repFeedback}
            <button
              onClick={this.toggleFeedbackLog}
              className="flex flex-row items-center justify-center"
              id="show-log-button"
            >
              <span className="text-zinc-400">Show Feedback Log</span>
              <img
                className={`${this.state.feedbackLogShowing && "rotate-180"} `}
                src={expandIcon}
                alt="expand icon"
                height="36"
                width="36"
              />
            </button>
            {this.state.feedbackLogShowing && (
              <span className="mt-1">{this.state.repFeedbackLog}</span>
            )}
          </TextBox>

          <TextBox className="bg-zinc-100 p-3 w-4/5 mt-3">
            {this.state.generalFeedback}
          </TextBox>
        </div>
        <div id="button-container" className="absolute bottom-10 w-screen flex justify-center">
          {this.state.detectorLoading ?
            <IonSpinner></IonSpinner>
            :
            <StartEndButton detector={this.state.detector} start={this.start} end={this.end} startButton={this.state.startButton} setState={this.setState} parentState={this.state} />
          }
        </div>

        <img src="" alt="" ref={this.image} className="hidden" />
      </div>
    );
  };

  /*--------------------
  MOVENET METHODS
  --------------------*/

  /**
   * Starts Exercise
   */
  start = async () => {
    if (this.state.detector === null) {
      window.alert("loading!");
      return
    }
    console.log("start");
    this.setState({
      repFeedback: "",
      generalFeedback: "Loading...",
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
      let poses = await this.state.detector.estimatePoses(this.webcam.current.video);
      await delay(1);
      // process raw data
      let newFeedback = formCorrection.run(poses);
      if (newFeedback[0] !== "") {
        console.log(newFeedback[0][0]);
        this.setState({
          repCount: newFeedback[0].slice(-1)[0].match(/\d+/)[0],
        });
        this.setState({ repFeedback: newFeedback[0].slice(-1) });
        this.setState({ repFeedbackLog: newFeedback[0] });
        read(newFeedback[0][newFeedback[0].slice(-1)]);
      }
      if (newFeedback[1] != feedback[1])
        this.setState({ generalFeedback: newFeedback[1] });
      feedback = newFeedback;
      frameCount += 1;
    }
  };

  /**
   * Ends Exercise
   */
  end = () => {
    isActive = false;
    console.log("End");
    let completedFeedback = formCorrection.endExercise();
    this.setState({
      repFeedback: completedFeedback[0],
      perfectRepCount: completedFeedback[1],
      generalFeedback: "Exercise ended",
    });
    console.log(completedFeedback);
  };

  assignImgHeight = () => {
    let screenshot = this.webcam.current.getScreenshot();
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

export default VideoFeed;
