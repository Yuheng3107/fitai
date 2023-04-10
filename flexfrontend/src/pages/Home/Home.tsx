

//Ionic imports
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

//Component imports
import Feed from '../../components/Feed/Feed';

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
        <Feed />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
