import { useEffect, useState } from "react";

//ionic imports
import {
  IonContent,
  IonPage,
  IonItem
} from "@ionic/react";

import VideoFeed from "../../components/Exercise/video";
import { backend } from "../../App";
import ExerciseCard from "../../components/Exercise/ExerciseCard";

//type imports
import { ExerciseCardProps } from "../../components/Exercise/ExerciseCard";

const ChooseExercise = () => {

  const [exerciseCardArray, setExerciseCardArray] = useState<ExerciseCardProps[]>([
    {
      name: "",
      likes: 0,
      media: ""
    }
  ])

  useEffect(() => {
    console.log("useEffect running");
    console.log(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1])
    async function getExercises() {
      try {
        const response = await fetch(backend.concat('/exercises/exercise/list'), {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": String(
              document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
            ),
          },
        });
        const data = await response.json();
        setExerciseCardArray(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    getExercises();
  }, [backend])
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonItem routerLink="/exercise/placeholder">
          Start
        </IonItem>
        <section id="Exercises-container">
          <p>Exercises</p>
          <div className="flex flex-row">
            {exerciseCardArray.map((cardInfo) => (
              <ExerciseCard name={cardInfo.name} likes={cardInfo.likes} media={cardInfo.media} />
            ))}
          </div>

        </section>
      </IonContent>
    </IonPage>
  );
};

export default ChooseExercise;
