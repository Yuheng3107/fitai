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
            <main className="bg-blue-500">
                <input type="text" className="bg-transparent" placeholder="Post Title" />
                <input type="text" placeholder="optional body text" />
            </main>
        </IonContent>
    </IonPage>
}

export default CreatePost;