//React imports
import { useState } from "react";

import {
  IonContent,
  IonPage,
} from "@ionic/react";

//component imports
import ExerciseOptions from "../../components/Exercise/ExerciseOptions";
import VideoFeed from "../../components/Exercise/video";


const Tab2: React.FC = () => {
  const [isExercising, setIsExercising] = useState(false)

  function startExerciseHandler(event: React.MouseEvent<HTMLButtonElement>) {
    setIsExercising(true);
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {isExercising ? <VideoFeed /> : <ExerciseOptions startExerciseHandler={startExerciseHandler} />}

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
