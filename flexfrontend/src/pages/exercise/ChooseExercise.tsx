import { useEffect } from "react";

//ionic imports
import {
  IonContent,
  IonPage,
  IonItem
} from "@ionic/react";

import VideoFeed from "../../components/Exercise/video";
import { backend } from "../../App";
import ExerciseCard from "../../components/Exercise/ExerciseCard";

const ChooseExercise = () => {
  useEffect(() => {
    console.log("useEffect running");
    async function getExercises() {
      try {
        const response = await fetch(backend.concat('/exericse/list'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
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
          <ExerciseCard title="Squats"></ExerciseCard>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default ChooseExercise;
