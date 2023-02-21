import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';

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

  componentDidMount = () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      navigator.mediaDevices
        .getUserMedia(this.state.constraints)
        .then((stream) => {
          this.setState({ stream });
          this.videoRef.current.srcObject = stream;
        })
        .catch((error) => console.error(error));
    }
  };

  render() {
    return (
      <React.Fragment>
        <video ref={this.videoRef} autoPlay></video>
        <button type="button" onClick={() => this.start()}>Start</button>
        <button type="button" onClick={() => this.end()}>End</button>
      </React.Fragment>
    );
  }

  ////////
  // TF movenet
  async start() {
    console.log("Start");
    this.isActive = true;
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    while (this.isActive) {
      const poses = await detector.estimatePoses(this.videoRef.current);
      console.log(poses);  
    }
  }
  end(){
    this.isActive = false;
    console.log("End");
  }
}

export default VideoFeed;
