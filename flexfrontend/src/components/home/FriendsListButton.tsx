import { IonButton } from "@ionic/react";
import { useEffect } from "react";
type FriendsListButtonProps = {
    // closeSideMenu: () => Promise<boolean>;
    closeSideMenu: () => void;
}
function FriendsListButton({ closeSideMenu }: FriendsListButtonProps) {

    useEffect(() => {

    }, []);

    return <aside>
        <IonButton routerLink="/profile/friendslist" onClick={() => closeSideMenu()}>
            Friends
        </IonButton>
    </aside>
}


export default FriendsListButton;