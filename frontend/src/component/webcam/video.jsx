import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

import Button from "../ui/Button";

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
            className="bg-green-400 w-16 mx-2"
          >
            Start
          </Button>
          <Button onClick={() => this.end()} className="bg-amber-200 w-16 mx-2">
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
    while (this.isActive) {
      let poses = await detector.estimatePoses(this.videoRef.current);
      console.log(poses[0]);
      fetch("http://localhost:8000/live_exercise/handle_key_points/", {
        method: "POST",
        credentials: "include", // include cookies in the request
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.cookie.match(/csrftoken=([\w-]+)/)[1],
        },
        body: JSON.stringify(),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      await delay(1);
    }
  };
  end = () => {
    this.isActive = false;
    console.log("End");
  };
}

export default VideoFeed;
