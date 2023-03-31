import React, { Component } from "react";
import { isMobile, isSafari, isFirefox } from "react-device-detect";
import Webcam from "react-webcam";


//components
import Button from "../ui/Button";
import TextBox from "../ui/TextBox";

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
      generalFeedback: "some stuff general feedback sample",
      feedbackLogShowing: false,
      startButton: true,
    };

    this.webcam = React.createRef();
    this.image = React.createRef();
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
        <div className="exercise-feedback flex flex-col items-center p-5 w-full">
          <div className="flex justify-center items-center text-6xl pb-2 text-zinc-900 font-medium
          aspect-square w-28 border-8 border-sky-700 rounded-full">
            <span className="block p-0 m-0">{this.state.repCount}</span>
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
        <div id="button-container" className="absolute bottom-10 w-screen flex justify-center">
          <Button
            onClick={() => {
              this.start();
              this.setState({
                startButton: false
              })
            }}
            className={`${this.state.startButton ? "" : "hidden"} bg-blue-400 w-16 h-16 mx-2 text-zinc-900
            flex justify-center items-center p-0 aspect-square`}
          >
            <PlayIcon className="h-14 w-14 fill-white" />
          </Button>
          <Button
            onClick={() => {
              this.end();
              this.setState({
                startButton: true
              })
            }}
            className={`${this.state.startButton ? "hidden" : ""} bg-amber-300 w-16 mx-2 text-zinc-900
            flex justify-center items-center p-0 aspect-square`}
          >
            <StopIcon className="h-14 w-14 fill-white" />
          </Button>
        </div>
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
