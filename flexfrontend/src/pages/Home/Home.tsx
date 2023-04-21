import { useState, useRef } from 'react';

//Ionic imports
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenu, IonMenuButton } from '@ionic/react';

//Component imports
import Feed from '../../components/Feed/Feed';
import SearchBar from '../../components/Feed/SearchBar';
import CommunitiesList from '../../components/home/CommunitiesList';
import FriendsListButton from '../../components/home/FriendsListButton';

const Home: React.FC = () => {
  const [sideMenuShowing, setSetMenuShowing] = useState(false);
  const sideMenuRef = useRef<HTMLIonMenuElement>(null);

  function closeSideMenu () {
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
        <CommunitiesList closeSideMenu={closeSideMenu}/>
        <FriendsListButton closeSideMenu={closeSideMenu}/>
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
