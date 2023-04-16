//React imports
import { useState } from 'react';

//ionic imports
import {
    IonPage,
    IonContent,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonButtons
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import TextInput from "../../components/ui/TextInput";

import { backend } from '../../App';


function CreatePost() {
    const [postTitleInput, setPostTitleInput] = useState("");
    const [postTextInput, setPostTextInput] = useState("");

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <div className="saturate-0 ml-1">
                        <IonBackButton text="" icon={closeOutline}></IonBackButton>
                    </div>
                </IonButtons>
                <IonButtons slot="end">
                    <button className="mr-1 rounded-lg bg-sky-400 py-2 px-3 text-white"
                        onClick={(event) => {
                            fetch(`${backend}/feed/user_post/create`, {
                                method: "POST",
                                headers: {
                                    "X-CSRFToken": String(
                                        document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                                    ),
                                    "Content-type": "application/json"
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                    title: postTitleInput,
                                    text: postTextInput,
                                }),
                            }).then((response) => {
                                console.log(response);
                            }).catch((err) => {
                                console.log(err);
                            });
                        }}>
                        Post
                    </button>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <div></div>
            <main className="flex flex-col h-full">
                <input value={postTitleInput} type="text" placeholder="Post Title"
                    className="bg-transparent block p-4 text-2xl focus:outline-0"
                    onChange={(event) => {
                        setPostTitleInput(event.target.value);
                    }} />
                <hr className="border-t border-t-slate-300" />
                <textarea value={postTextInput} placeholder="optional body text block"
                    className="bg-transparent block p-4 text-xl font-light focus:outline-0 h-full"
                    onChange={(event) => {
                        setPostTextInput(event.target.value);
                        console.log(postTextInput);
                    }} />
            </main>
        </IonContent>
    </IonPage>
}

export default CreatePost;