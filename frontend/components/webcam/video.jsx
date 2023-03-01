import React, { Component } from "react";
import { isMobile, isSafari, isFirefox } from "react-device-detect";
import Webcam from "react-webcam";

//components
import Button from "../ui/Button";
import TextBox from "../ui/TextBox";

//MoveNet
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

//formCorrection
import * as formCorrection from "../../utils/formCorrection.js";

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    // formCorrection
    this.feedback = new Array();
    this.repFeedback = React.createRef();
    this.generalFeedback = React.createRef();
    this.isActive = false;
    this.frameCount = 0;
  }

  componentDidMount = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    this.detector = await poseDetection.createDetector(
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
        <div>
          <TextBox ref={this.repFeedback} />
          <TextBox ref={this.generalFeedback} />
        </div>
      </React.Fragment>
    );
  };

  ////////
  // TF movenet
  start = async () => {
    console.log("start");
    this.isActive = true;
    this.flippedImage = false;
    this.frameCount = 0;
    this.feedback = ["", ""];
    this.repFeedback.current.changeText("");
    this.generalFeedback.current.changeText("Loading...");
    const detector = this.detector;

    // get from backend
    let evalposes = [new Float32Array([0, 0, 0, 0, 1.0, 0, 0, 0, 0.7, 0, 0])];
    let angleweights = new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0]);
    let anglethresholds = [
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
    ];
    let glossaryy = [
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
    ];

    formCorrection.init(
      evalposes,
      0.7,
      0.02,
      angleweights,
      anglethresholds,
      2000,
      glossaryy
    );

    while (this.isActive) {
      if (!this.flippedImage) {
        let screenshot = this.webcam.current.getScreenshot();
        let img = new Image();
        img.src = screenshot;
        this.flippedImage = true;
        img.onload = () => {
          // window.alert(`Width is ${img.width}, Height is ${img.height}`);
          // Changes height and width of video in Webcam component
          if (isMobile && (isFirefox || isSafari)) {
            // Firefox and Safari has issues which cause the images to have wrong aspect ratio,
            // so we need to correct them
            [
              this.webcam.current.video.width,
              this.webcam.current.video.height,
            ] = [img.height, img.width];
          } else {
            // set explicit width and height for video
            [
              this.webcam.current.video.width,
              this.webcam.current.video.height,
            ] = [img.height, img.width];
          }
        };
      }

      let poses = await detector.estimatePoses(this.webcam.current.video);
      await delay(1);
      // process raw data
      let feedback = formCorrection.run(poses);
      if (feedback[0] != "") this.repFeedback.current.changeText(feedback[0]);
      if (feedback[1] != this.feedback[1])
        this.generalFeedback.current.changeText(feedback[1]);
      this.feedback = feedback;
      this.frameCount += 1;

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
  end = () => {
    this.isActive = false;
    console.log("End");
    this.repFeedback.current.changeText(formCorrection.endExercise());
    this.generalFeedback.current.changeText(this.frameCount);
  };
}

export default VideoFeed;
