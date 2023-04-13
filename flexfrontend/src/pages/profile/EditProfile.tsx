import React, { SyntheticEvent, useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

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
import UpdateProfilePic from '../../components/profile/UpdateProfilePic';
import TextInput from '../../components/ui/TextInput';
import TextAreaInput from '../../components/ui/TextAreaInput';

import { backend } from '../../App';
import Button from '../../components/ui/Button';

//utils imports
import getProfileData from '../../utils/getProfileData';


//types import
import { ProfileData, emptyProfileData } from '../../types/stateTypes';

type EditProfileProps = {
    setUpdateProfileState: (newState: number) => void;
    updateProfileState: number;
}

// Functional Component
function EditProfile({ setUpdateProfileState, updateProfileState }: EditProfileProps) {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLTextAreaElement>(null);
    const history = useHistory();

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
                username: usernameInputRef.current?.value,
                bio: bioInputRef.current?.value
            }),
        }).then((response) => {
            // do something with response
            console.log(response);
            history.push('/profile')
            setUpdateProfileState(updateProfileState + 1);
        }).catch((err) => {
            console.log(err);
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
                <UpdateProfilePic setUpdateProfileState={setUpdateProfileState} updateProfileState={updateProfileState} />
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