import React, { useState } from 'react';

//ion imports
import { IonPage, IonContent, useIonToast } from '@ionic/react';

import { backend } from '../../App';

function CreateCommunity() {
    const [communityNameInput, setCommunityNameInput] = useState("");
    const [communityDescriptionInput, setCommunityDescriptionInput] = useState("");
    const [toast] = useIonToast();

    function presentToast(message: string) {
        toast({
            message: message,
            duration: 1500,
            position: 'top'
        })
    }

    function createCommunityHandler(event: React.FormEvent) {
        event.preventDefault();

        if (communityNameInput.trim() === "" && communityDescriptionInput.trim() === "") {
            presentToast("Please enter a name and description for your community");
            return
        } else if (communityNameInput.trim() === "") {
            presentToast("Please enter a name for your community");
            return
        } else if (communityDescriptionInput.trim() === "") {
            presentToast("Please enter a description for your community");
            return
        }
        
        fetch(`${backend}/community/community/create`, {
            method: "POST",
            headers: {
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
                "Content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: communityNameInput,
                description: communityDescriptionInput,
                privacy_level: 1,
            }),
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
    }

    return <IonPage>
        <IonContent>
            <form onSubmit={createCommunityHandler}>
                <InputTextComponent value={communityNameInput} onChangeFunction={(e) => {
                    setCommunityNameInput(e.target.value);
                }} label="Community Name" id="community_name" />
                <InputTextComponent value={communityDescriptionInput} onChangeFunction={(e) => {
                    setCommunityDescriptionInput(e.target.value);
                }} label="Community Description" id="community_description" />
                <button className="border-2 border-orange-400 p-2" type="submit">Create Community</button>
            </form>
        </IonContent>
    </IonPage>
}

type InputComponentProps = {
    label: string;
    id: string;
    onChangeFunction: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}
function InputTextComponent({ label, id, onChangeFunction }: InputComponentProps) {
    return <div>
        <label htmlFor={id}>{label}</label>
        <input minLength={1} onChange={onChangeFunction} className={`bg-transparent focus:outline-none border border-gray-500 rounded-sm ml-2`} id={id} name={id} type="text" />
    </div>
}

export default CreateCommunity;