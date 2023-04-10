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


const ChooseExercise = () => {

  const [exerciseCardArray, setExerciseCardArray] = useState([
    { title: "Squats" },
    { title: "Pushups" },
    { title: "humping" }
  ])

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
          <div className="flex flex-row">
            {exerciseCardArray.map((cardInfo) => (
              <ExerciseCard title={cardInfo.title} />
            ))}
          </div>

        </section>
      </IonContent>
    </IonPage>
  );
};

export default ChooseExercise;
