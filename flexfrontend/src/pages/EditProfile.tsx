import React from 'react';

//Ionic Imports
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonButtons

} from '@ionic/react';

//Component imports
import UpdateProfilePic from '../components/profile/UpdateProfilePic.jsx';

function EditProfile() {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                <IonTitle>Edit Profile</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <UpdateProfilePic />
        </IonContent>
    </IonPage>
}

export default EditProfile;