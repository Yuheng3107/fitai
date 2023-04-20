

//Ionic imports
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons } from '@ionic/react';

//Component imports
import Feed from '../../components/Feed/Feed';
import SearchBar from '../../components/Feed/SearchBar';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            menu
            
            <SearchBar />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="relative">
        <Feed />
      </IonContent>
    </IonPage>
  );
};

export default Home;
