
//Ionic Imports
import { IonPage, IonContent, IonRouterOutlet } from "@ionic/react";
import { Route, RouteComponentProps } from "react-router";


//Page component imports
import CreateCommunity from "./CreateCommunity";
import CommunityDisplay from "./CommunityDisplay";
import CreateCommunityPost from "./CreateCommunityPost";

interface CommunityPageProps extends RouteComponentProps<{
}> { }

//This component defines the routes following /community
function CommunityPage({ match }: CommunityPageProps) {
    return <IonPage>
        <IonRouterOutlet>
            <Route exact path={`${match.url}/:communityId`} render={(props) => {
                return <CommunityDisplay {...props} />;
            }} />
            <Route exact path={`${match.url}/create`}>
                <CreateCommunity />
            </Route>
            <Route exact path={`${match.url}/:communityId/create`} render={(props) => {
                return <CreateCommunityPost {...props} />;
            }} />
        </IonRouterOutlet>
    </IonPage>;
}

export default CommunityPage;