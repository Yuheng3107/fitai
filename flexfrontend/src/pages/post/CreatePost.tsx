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


function CreatePost() {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <div className="saturate-0">
                        <IonBackButton text="" icon={closeOutline}></IonBackButton>
                    </div>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <div></div>
            <main className="flex flex-col">
                <input type="text" placeholder="Post Title"
                    className="bg-transparent block p-4 text-2xl focus:outline-0" />
                <hr className="border-t border-t-slate-300"/>
                <input type="text" placeholder="optional body text block"
                    className="bg-transparent block p-4 text-xl font-light focus:outline-0" />
            </main>
        </IonContent>
    </IonPage>
}

export default CreatePost;