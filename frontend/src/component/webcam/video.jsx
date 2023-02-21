import React, { Component } from "react";
import { isMobile } from "react-device-detect";

class VideoFeed extends Component {
  constructor(props) {
    super(props);

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
      </React.Fragment>
    );
  }
}

export default VideoFeed;
