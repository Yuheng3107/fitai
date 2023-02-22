import React, { Component, useRef, useEffect, useState } from "react";
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

function VideoFeed(props) {
  const [isActive, setIsActive] = useState(false);
  const [streamState, setStreamState] = useState({
    stream: null,
    constraints: {
      video: {
        facingMode: "user",
        // tries to get camera that faces user
      },
    },
  });
  const [detector, setDetector] = useState(null);


  const videoRef = useRef();

  async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }



  useEffect(() => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      navigator.mediaDevices
        .getUserMedia(streamState.constraints)
        .then((stream) => {
          setStreamState({ stream });
          videoRef.current.srcObject = stream;
          return new Promise((resolve) => {
            videoRef.onloadedmetadata = () => {
              videoRef.play();
              resolve(videoRef);
            };
          });
        })
        .catch((error) => console.error(error));
    }
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };

    const makeDetector = async () => {
      let newDetectorState = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setDetector(newDetectorState);
    }

    makeDetector();

  }, [])


  ////////
  // TF movenet
  const start = async () => {
    console.log("start");
    setIsActive(true);
    while (isActive) {
      let poses = await detector.estimatePoses(videoRef.current);
      console.log(poses[0]);
      fetch("http://localhost:8000/live_exercise/handle_key_points/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poses[0]),
      })
        .then((response) => response.text())
        .then((data) => {
          //console.log(data);
        });
      await delay(1);
    }
  };
  const end = () => {
    setIsActive = false;
    console.log("End");
  };

  return <React.Fragment>
    <video ref={videoRef} autoPlay></video>
    <button type="button" onClick={() => start()}>
      Start
    </button>
    <button type="button" onClick={() => end()}>
      End
    </button>
  </React.Fragment>
}

// class VideoFeed extends Component {
//   constructor(props) {
//     super(props);
//     this.isActive = false;

//     this.videoRef = React.createRef();
//     this.state = {
//       stream: null,
//       constraints: {
//         video: {
//           facingMode: "user",
//           // tries to get camera that faces user
//         },
//       },
//     };
//   }

//   componentDidMount = async () => {
//     if (
//       "mediaDevices" in navigator &&
//       "getUserMedia" in navigator.mediaDevices
//     ) {
//       navigator.mediaDevices
//         .getUserMedia(this.state.constraints)
//         .then((stream) => {
//           this.setState({ stream });
//           this.videoRef.current.srcObject = stream;
//           return new Promise((resolve) => {
//             this.videoRef.onloadedmetadata = () => {
//               this.videoRef.play();
//               resolve(this.videoRef);
//             };
//           });
//         })
//         .catch((error) => console.error(error));
//     }
//     const detectorConfig = {
//       modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
//     };
//     this.detector = await poseDetection.createDetector(
//       poseDetection.SupportedModels.MoveNet,
//       detectorConfig
//     );
//   };

//   render = () => {
//     return (
//       <React.Fragment>
//         <video ref={this.videoRef} autoPlay></video>
//         <button type="button" onClick={() => this.start()}>
//           Start
//         </button>
//         <button type="button" onClick={() => this.end()}>
//           End
//         </button>
//       </React.Fragment>
//     );
//   };

//   ////////
//   // TF movenet
//   start = async () => {
//     console.log("start");
//     this.isActive = true;
//     const detector = this.detector;
//     while (this.isActive) {
//       let poses = await detector.estimatePoses(this.videoRef.current);
//       console.log(poses[0]);
//       fetch("http://localhost:8000/live_exercise/handle_key_points/", {
//         method: "POST",
//       })
//         .then((response) => response.text())
//         .then((data) => {
//           //console.log(data);
//         });
//       await delay(1);
//     }
//   };
//   end = () => {
//     this.isActive = false;
//     console.log("End");
//   };
// }

export default VideoFeed;
