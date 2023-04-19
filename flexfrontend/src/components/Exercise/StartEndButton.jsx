import Button from "../ui/Button";

import PlayIcon from "../../assets/svgComponents/playIcon";
import StopIcon from "../../assets/svgComponents/stopIcon";

import { backend } from "../../App";

function StartEndButton(props) {

    function startButtonHandler(event) {
        props.start();
        props.setState({
            startButton: false
        })
    }
    console.log(props.parentState);

    function endButtonHandler(event) {
        props.end();
        props.setState({
            startButton: true
        })
    }

    return <div id="button-container" className="absolute bottom-10 w-screen flex justify-center">
        <Button
            onClick={startButtonHandler}
            className={`${props.startButton ? "" : "hidden"} bg-blue-400 w-16 h-16 mx-2 text-zinc-900
      flex justify-center items-center p-0 aspect-square`}
        >
            <PlayIcon className="h-14 w-14 fill-white" />
        </Button>
        <Button
            onClick={endButtonHandler}
            className={`${props.startButton ? "hidden" : ""} bg-amber-300 w-16 h-16 mx-2 text-zinc-900
      flex justify-center items-center p-0 aspect-square`}
        >
            <StopIcon className="h-14 w-14 fill-white" />
        </Button>
    </div>

}

export default StartEndButton;