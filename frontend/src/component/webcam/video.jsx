import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-webgl";
// import '@tensorflow/tfjs-backend-wasm';

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
  state = {};

  async componentDidMount() {
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
  }

  render() {
    return (
      <React.Fragment>
        <video ref={this.videoRef} autoPlay></video>
        <button type="button" onClick={() => this.start()}>
          Start
        </button>
        <button type="button" onClick={() => this.end()}>
          End
        </button>
      </React.Fragment>
    );
  }

  ////////
  // TF movenet
  async start() {
    console.log("start");
    console.log(this);
    this.isActive = true;
    const detector = this.detector;
    while (this.isActive) {
      let poses = await detector.estimatePoses(this.videoRef.current);
      console.log(poses);
      await delay(1);
    }
  }
  end() {
    this.isActive = false;
    console.log("End");
  }
}

export default VideoFeed;
