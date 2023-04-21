
import { useState, useEffect, useReducer } from 'react';

import { IonPage, IonContent } from '@ionic/react';
import { RouteComponentProps } from "react-router";

//utils imports
import { getCommunityAsync, getCommunitiesListAsync } from '../../utils/getData/getCommunityData';
import { backend } from '../../App';

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }

function CommunityDisplay({ match }: CommunityDisplayProps) {
    const [communityData, setCommunityData] = useState();

    useEffect(() => {
        async function getCommunityData(pk: number) {
            setCommunityData(await getCommunityAsync(pk));
            console.log(await getCommunitiesListAsync());
        }


        getCommunityData(Number(match.params.communityId));

    }, [match])

    return <IonPage>
        <IonContent>
            This is a community
        </IonContent>
    </IonPage>
}

export default CommunityDisplay;