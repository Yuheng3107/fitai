import Button from "../ui/Button";

import PlayIcon from "../../assets/svgComponents/playIcon";
import StopIcon from "../../assets/svgComponents/stopIcon";

import { backend } from "../../App";

//redux imports
import { useAppSelector } from "../../store/hooks";

function StartEndButton(props) {
  const profileDataRedux = useAppSelector((state) => state.profile.profileData);
  function startButtonHandler(event) {
    if (props.parentState.detector == null) {
      window.alert("loading!");
    } else {
      props.start();
      props.setState({
        startButton: false,
      });
    }
    // console.log(props.parentState.detector);
    // props.start();
    // props.setState({
    //     startButton: false
    // })
  }
  console.log(props.parentState);

  function endButtonHandler(event) {
    console.log(
      JSON.stringify({
        exercise_id: 1,
        total_reps: Number(props.parentState.repCount),
        perfect_reps: Number(props.parentState.perfectRepCount),
      })
    );
    props.end();
    props.setState({
      startButton: true,
    });
    fetch(`${backend}/exercises/exercise_statistics/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(
          document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
        ),
      },
      credentials: "include",
      body: JSON.stringify({
        exercise_id: 1,
        total_reps: Number(props.parentState.repCount),
        perfect_reps: Number(props.parentState.perfectRepCount),
      }),
    })
      .then((response) => {
        // do something with response
        console.log(response);
        return response.json();
      })
      .then((body) => {
        console.log(body);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Button
        onClick={startButtonHandler}
        className={`${
          props.startButton ? "" : "hidden"
        } bg-blue-400 w-16 h-16 mx-2 text-zinc-900
      flex justify-center items-center p-0 aspect-square`}
      >
        <PlayIcon className="h-14 w-14 fill-white" />
      </Button>
      <Button
        onClick={endButtonHandler}
        className={`${
          props.startButton ? "hidden" : ""
        } bg-amber-300 w-16 h-16 mx-2 text-zinc-900
      flex justify-center items-center p-0 aspect-square`}
      >
        <StopIcon className="h-14 w-14 fill-white" />
      </Button>
    </>
  );
}

export default StartEndButton;
