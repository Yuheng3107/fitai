import React, { SyntheticEvent, useRef, useEffect, useState } from 'react';

//Ionic Imports
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonButtons,
    IonButton

} from '@ionic/react';

//Component imports
import UpdateProfilePic from '../components/profile/UpdateProfilePic';
import TextInput from '../components/ui/TextInput';
import TextAreaInput from '../components/ui/TextAreaInput';

import { backend } from '../App';
import Button from '../components/ui/Button';

//utils imports
import getProfileData from '../utils/getProfileData';


//types import
import { ProfileData, emptyProfileData } from '../types/stateTypes';

function EditProfile() {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLTextAreaElement>(null);

    const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData)

    useEffect(() => {
        getProfileData(setProfileData);
    }, [getProfileData])

    function usernameFormHandler(event: SyntheticEvent) {
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
        <IonContent >
            <div className="p-10">
                <UpdateProfilePic />
                <TextInput defaultValue={profileData.username} ref={usernameInputRef} inputName="username" label="Username" />
                <TextAreaInput className="mt-3" ref={bioInputRef} inputName="bio" label="Bio" ></TextAreaInput>
                <div className="flex flex-row justify-end">
                    <Button onClick={usernameFormHandler} className={`mt-3 bg-blue-500 text-white w-5/12`} type="submit">Update Profile</Button>
                </div>

            </div>


        </IonContent>
    </IonPage >
}

export default EditProfile;