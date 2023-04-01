

//Ionic imports
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Tab1: React.FC = () => {

  console.log(process.env.REACT_APP_CLIENTID)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="relative">
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
