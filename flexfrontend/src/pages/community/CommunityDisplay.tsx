
import { useState, useEffect, useReducer } from 'react';

import { IonPage, IonContent } from '@ionic/react';
import { RouteComponentProps } from "react-router";

//utils imports
import { getCommunityAsync } from '../../utils/getData/getCommunityData';
import { backend } from '../../App';
import ShareIcon from '../../assets/svgComponents/ShareIcon';

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }

function CommunityDisplay({ match }: CommunityDisplayProps) {
    const [communityData, setCommunityData] = useState({
        banner: "",
        created_at: "",
        created_by: 0,
        description: "",
        id: 0,
        name: "",
        privacy_level: 0
    });

    useEffect(() => {
        async function getCommunityData(pk: number) {
            let communityDetails = await getCommunityAsync(pk);
            console.log(communityDetails);
            setCommunityData(communityDetails);
        }


        getCommunityData(Number(match.params.communityId));

    }, [match])

    return <IonPage>
        <IonContent>
            <main className="h-full">
                <MainInfo communityData={communityData} />
            </main>
        </IonContent>
    </IonPage>
}

type MainInfoProps = {
    communityData: {
        banner: null | string;
        created_at: string;
        created_by: number;
        description: string;
        id: number;
        name: string;
        privacy_level: number
    }
}
function MainInfo({ communityData }: MainInfoProps) {
    return <div className="flex flex-col">
        {/* {communityData.banner ? "No Banner Here" :
            <img src="" alt="" />} */}
        <img src="https://www.ortho.com.sg/wp-content/uploads/2018/04/squats-in-the-gym.jpg" className="w-full h-36 object-cover" alt="" />
        <div id="name-and-actions" className="mt-3 px-4 flex flex-rol justify-end items-center">
            <span className="mx-2 text-2xl font-semibold">{communityData.name}</span>
            <button className=" mr-1 px-4 rounded-full bg-orange-400 text-white h-8">
                join
            </button>
            <button className=" aspect-square bg-gray-300 rounded-full h-8 flex justify-center items-center">
                <ShareIcon className={`h-6 w-6`}/>
            </button>
        </div>
        <p id="description" className="px-4">{communityData.description}</p>
    </div>
}

export default CommunityDisplay;