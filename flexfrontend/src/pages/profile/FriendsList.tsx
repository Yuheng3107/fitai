import { useEffect } from 'react';

// Ionic imports
import {
    IonPage,
    IonContent
} from '@ionic/react';

//redux imports
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { profileDataActions } from '../../store/profileDataSlice';

// component imports
import FriendDisplay from '../../components/friends/FriendDisplay';
import FriendRequestDisplay from '../../components/friends/FriendRequestDisplay';
import SentFriendRequestDisplay from '../../components/friends/SentFriendRequestDisplay';

function FriendsList() {
    const profileDataRedux = useAppSelector((state) => state.profile.profileData)
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     console.log('use effect ran in friendslist.tsx');
    //     dispatch(profileDataActions.updateProfileCounter);
    // }, [])
    return <IonPage>
        <IonContent>
            <div>Friends</div>
            <FriendDisplay friends={profileDataRedux.followers} />
            <div>Incoming Friend Requests</div>
            <FriendRequestDisplay friend_requests={profileDataRedux.friend_requests} />
            <div>Sent Friend Requests</div>
            <SentFriendRequestDisplay friend_requests={profileDataRedux.sent_friend_requests} />
        </IonContent>
    </IonPage>
}

export default FriendsList