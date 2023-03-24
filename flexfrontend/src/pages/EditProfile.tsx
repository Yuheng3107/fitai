import React, { useRef } from 'react';

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
import UpdateProfilePic from '../components/profile/UpdateProfilePic';
import TextInput from '../components/ui/TextInput';

import { backend } from '../App';

function EditProfile() {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    function usernameFormHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        fetch(`${backend}/users/user/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
            },
            credentials: "include",
            body: JSON.stringify({
                username: usernameInputRef.current?.value
            }),
        }).then((response) => {
            // do something with response
            console.log(response);
        });
    }
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
            <form onSubmit={usernameFormHandler}>
                {/* <input type="text" ref={usernameInputRef} placeholder='username' /> */}

                <TextInput ref={usernameInputRef} inputName="placeholder" label="test input" />
                <input type="submit" />

            </form>

        </IonContent>
    </IonPage>
}

export default EditProfile;