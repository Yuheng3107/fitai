import { useEffect, useState } from "react";

//ionic imports
import {
  IonContent,
  IonPage,
  IonItem
} from "@ionic/react";

import { backend } from "../../App";
import ExerciseCard from "../../components/Exercise/ExerciseCard";

type ExerciseInfo = {
  id: number;
  likers: number[];
  likes:number;
  media: string;
  name: string;
  perfect_reps: number;
  posted_at: "string";
  poster: number;
  shared_id: number;
  shared_type: number;
  tags: string[];
  text: string;
  total_reps: number;
}

const ChooseExercise = () => {

  const [exerciseCardArray, setExerciseCardArray] = useState<ExerciseInfo[]>([])

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


  for (let card of exerciseCardArray) {
    console.log(card)
  }
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
              <ExerciseCard name={cardInfo.name} likes={cardInfo.likes} media={cardInfo.media} exerciseId={cardInfo.id} />
            ))}
          </div>

        </section>
      </IonContent>
    </IonPage>
  );
};

export default ChooseExercise;
