import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { backend } from '../../App';

function CreateCommunity() {

    function createCommunityHandler(event: React.FormEvent) {
        event.preventDefault();
        fetch(`${backend}/community/community/create`, {
            
        })
    }

    return <IonPage>
        <IonContent>
            <form>

                <input type="text" />
            </form>
        </IonContent>
    </IonPage>
}

export default CreateCommunity;