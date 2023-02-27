import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

import Button from "../ui/Button";
import * as formCorrection from "../../utils/formCorrection.js";

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.isActive = false;

    this.videoRef = React.createRef();
    this.state = {
      stream: null,
      constraints: {
        video: {
          facingMode: "user",
          // tries to get camera that faces user
        },
      },
    };
  }

  componentDidMount = async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      navigator.mediaDevices
        .getUserMedia(this.state.constraints)
        .then((stream) => {
          this.setState({ stream });
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve) => {
            this.videoRef.onloadedmetadata = () => {
              this.videoRef.play();
              resolve(this.videoRef);
            };
          });
        })
        .catch((error) => console.error(error));
    }

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
        <video className="pt-4 pb-3" ref={this.videoRef} autoPlay></video>
        <div>
          <Button
            onClick={() => this.start()}
            className="bg-green-300 w-16 mx-2 text-zinc-900 
            dark:bg-lime-700 dark:hover:bg-lime-500 dark:text-zinc-100"
          >
            Start
          </Button>
          <Button onClick={() => this.end()} className="bg-amber-200 w-16 mx-2 text-zinc-900 
          dark:bg-yellow-600 dark:hover:bg-amber-500 dark:text-zinc-100 ">
            End
          </Button>
        </div>
      </React.Fragment>
    );
  };

  ////////
  // TF movenet
  start = async () => {
    console.log("start");
    this.isActive = true;
    const detector = this.detector;

    let evalposes = new Array();
    evalposes[0] = new Float32Array([0.,0.,0.,0.,1.0,0.,0.,0.,0.7,0.,0.]);
    let angleweights = new Float32Array([0.,0.,0.,0.,1.,0.,0.,0.,-1.,0.,0.]);
    let anglethresholds = new Array();
    anglethresholds[0] = new Array(new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array([0.14,0.13]), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array([0.15,0]),new Float32Array(2), new Float32Array(2))
    let glossaryy = new Array();
    glossaryy[0] = [['',''],['',''],['',''],['',''],
    ['Squat not low enough','Squat too low'],
    ['',''],['',''],['',''],
    ['Leaning forward too much',''],
    ['',''],['','']];
    formCorrection.init(evalposes,0.7,0.02,angleweights,anglethresholds,glossaryy);

    while (this.isActive) {
      let poses = await detector.estimatePoses(this.videoRef.current);
      await delay(1);
      // process raw data
      let feedback = formCorrection.run(poses);
      if (feedback[0] != "") {
        console.log(feedback);
      }

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
    console.log(formCorrection.endExercise());
  };
}

export default VideoFeed;
