import React, { Component } from "react";
import { isMobile, isSafari, isFirefox } from "react-device-detect";
import Webcam from "react-webcam";


//components
import Button from "../ui/Button";
import TextBox from "../ui/TextBox";
import StartEndButton from "./StartEndButton";

//assets
import expandIcon from '../../assets/svg/expand-icon.svg'
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

let feedback = new Array();
let isActive = false;
let frameCount = 0;
let detector;
let synth;

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    
    this.setState = this.setState.bind(this); // <- try by adding this line

    this.state = {
      repCount: 0,
      repFeedback: "sample feedback for Rep 1",
      repFeedbackLog: "sample feedback for Rep 1. sample feedback for Rep 1. sample feedback for Rep 1",
      generalFeedback: "some stuff general feedback sample",
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
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
  };

  toggleFeedbackLog() {
    this.setState((prevState) => {
      console.log(prevState.feedbackLogShowing);
      return { feedbackLogShowing: !prevState.feedbackLogShowing }
    });
  }


  render = () => {
    return (
      <div className="relative h-full">
        <Webcam videoConstraints={{ facingMode: "user" }} ref={this.webcam} />
        <div className="exercise-feedback flex flex-col items-center p-5 w-full">
          <div id="rep-count-container" className="relative">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 200 200">
              <circle
                className="stroke-current text-blue-500"
                stroke="#4A5568"
                strokeWidth="14"
                fill="transparent"
                r="80"
                cx="50%"
                cy="50%"
                style={{
                  strokeDasharray: `${2 * Math.PI * 80}`,
                  //This line tells us how much of the ring should be blank
                  strokeDashoffset: (this.props.repCountInput - this.state.repCount) / this.props.repCountInput * 2 * Math.PI * 80,
                  transition: 'stroke-dashoffset 1000ms linear',
                  strokeLinecap: "round"
                }}
              />
            </svg>
            <span className="text-6xl p-0 m-0 flex justify-center items-center absolute left-0 top-0 w-32 h-32">{this.state.repCount}</span>
          </div>

          <TextBox className="flex flex-col justify-between bg-zinc-100 pt-3 pb-0 w-4/5 mt-3">
            {this.state.feedbackLogShowing}{this.state.repFeedback}
            <button onClick={this.toggleFeedbackLog} className="flex flex-row items-center justify-center" id="show-log-button">
              <span className="text-zinc-400">Show Feedback Log</span>
              <img className={`${this.state.feedbackLogShowing && "rotate-180"} `} src={expandIcon} alt="expand icon" height="36" width="36" />
            </button>
            {this.state.feedbackLogShowing && <span className="mt-1">{this.state.repFeedbackLog}</span>}
          </TextBox>



          <TextBox className="bg-zinc-100 p-3 w-4/5 mt-3">{this.state.generalFeedback}</TextBox>


        </div>
        <StartEndButton start={this.start} end={this.end} startButton={this.state.startButton} setState={this.setState} />
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
    let exercise = getExercise(1);

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
