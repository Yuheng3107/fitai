import React, { Component } from "react";
import { isMobile } from "react-device-detect";

class VideoFeed extends Component {
  state = {
    constraints: {
      video: {
        facingMode: "user",
        // tries to get camera that faces user
      },
    },
  };

  startVideo = () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      navigator.mediaDevices
        .getUserMedia(this.state.constraints)
        .then((stream) => {
          document.querySelector("video").srcObject = stream;
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <video src=""></video>
      </React.Fragment>
    );
  }
}

export default VideoFeed;
