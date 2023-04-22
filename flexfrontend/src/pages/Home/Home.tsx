import { useState, useRef } from 'react';

//Ionic imports
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenu, IonMenuButton, IonButton } from '@ionic/react';

//Redux imports
import { useAppDispatch } from '../../store/hooks';
import { profileDataActions } from '../../store/profileDataSlice';

//Component imports
import Feed from '../../components/Feed/Feed';
import SearchBar from '../../components/Feed/SearchBar';
import CommunitiesList from '../../components/home/CommunitiesList';

const Home: React.FC = () => {
  const [sideMenuShowing, setSetMenuShowing] = useState(false);
  const sideMenuRef = useRef<HTMLIonMenuElement>(null);
const dispatch = useAppDispatch();
  function closeSideMenu() {
    sideMenuRef.current?.close();
  }
  return <>
    {/* This is the content of the sideMenu  */}
    <IonMenu ref={sideMenuRef} contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu Content</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CommunitiesList closeSideMenu={closeSideMenu} />
        <IonButton routerLink="/profile/friendslist" onClick={() => {
          closeSideMenu();
          dispatch(profileDataActions.updateProfileCounter());
        }}>
          Friends
        </IonButton>
        <button onClick={() => {
          sideMenuRef.current?.close();
        }}>close</button>
      </IonContent>
    </IonMenu>
    {/* This is the main content of the page */}
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
            <SearchBar />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="relative">
        <Feed />
      </IonContent>
    </IonPage>
  </>


};

export default Home;
