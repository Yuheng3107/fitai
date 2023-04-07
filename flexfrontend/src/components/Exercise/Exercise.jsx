import React from "react";
import Webcam from "react-webcam";

import VideoFeed from "../webcam/video";
import Button from "../ui/Button";
import Select from "../ui/Select";
import expandIcon from "../../public/assets/svg/expand-icon.svg";

function Exercise() {
  
  return (
    <main className='flex flex-col items-center bg-slate-800 text-white'>
      <VideoFeed />
    </main>
  );
}

export default Exercise;
