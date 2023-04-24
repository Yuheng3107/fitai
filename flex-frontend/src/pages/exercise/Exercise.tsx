//React imports
import { useState } from "react";

import {
  IonContent,
  IonPage,
} from "@ionic/react";

//component imports
import ExerciseOptions from "../../components/Exercise/ExerciseOptions";
import VideoFeed from "../../components/Exercise/video";
import { RouteComponentProps } from "react-router";

interface ExercisePageProps
  extends RouteComponentProps<{
    exerciseId: string;
  }> { }

const ExercisePage: React.FC<ExercisePageProps> = ({ match }) => {

  console.log(match.params.exerciseId);
  const [isExercising, setIsExercising] = useState(false)
  const [repCountInput, setRepCountInput] = useState<number>(1);

  function startExerciseHandler(event: React.MouseEvent<HTMLButtonElement>) {
    setIsExercising(true);
  }

  const repIncrementHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRepCountInput((prevState) => {
      return (prevState + 1);
    })
  }
  const repDecrementHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (repCountInput > 1) {
      setRepCountInput((prevState) => {
        return (prevState - 1);
      })
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {isExercising ? <VideoFeed repCountInput={repCountInput} /> :
          <ExerciseOptions startExerciseHandler={startExerciseHandler}
            repDecrementHandler={repDecrementHandler} repIncrementHandler={repIncrementHandler}
            repCountInput={repCountInput} />}

      </IonContent>
    </IonPage>
  );
};

export default ExercisePage;
