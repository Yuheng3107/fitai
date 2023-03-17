import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import VideoFeed from '../components/Exercise/video';



const Tab1: React.FC = () => {
  console.log(process.env.REACT_APP_CLIENTID)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Exercise</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="relative">
        <VideoFeed />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
