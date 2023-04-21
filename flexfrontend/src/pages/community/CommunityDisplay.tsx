
import { IonPage, IonContent } from '@ionic/react';
import { RouteComponentProps } from "react-router";

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }

function CommunityDisplay({ match }: CommunityDisplayProps) {
    return <IonPage>
        <IonContent>
            This is a community
        </IonContent>
    </IonPage>
}

export default CommunityDisplay;