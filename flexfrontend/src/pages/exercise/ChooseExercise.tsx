import {
    IonContent,
    IonPage,
    IonItem
  } from "@ionic/react";
  
  import VideoFeed from "../../components/Exercise/video";
  
  const ChooseExercise = () => {
    return (
      <IonPage>
        <IonContent fullscreen>
            <IonItem routerLink="/exercise/placeholder">
                Start
            </IonItem>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ChooseExercise;
  