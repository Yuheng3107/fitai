import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import VideoFeed from '../components/exercise/video';
import { useParams } from 'react-router';
const Tab2: React.FC = () => {
  const param = useParams();
  console.log(param);
  return (
    <IonPage>
      <IonContent fullscreen>
        <VideoFeed />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
