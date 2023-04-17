

import { RouteComponentProps } from "react-router";

//ion importss
import {
    IonContent,
    IonPage,
} from "@ionic/react";

interface OtherUserProfileProps
    extends RouteComponentProps<{
        userId: string;
    }> { }

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({ match }) => {
    return <IonPage>
        <IonContent>
            This is the profile of user {match.params.userId}
        </IonContent>
    </IonPage>

}


export default OtherUserProfile;