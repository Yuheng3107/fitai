import { IonButton } from "@ionic/react";
import { useEffect } from "react";
type CommunitiesListProps = {
    // closeSideMenu: () => Promise<boolean>;
    closeSideMenu: () => void;
}
function CommunitiesList({ closeSideMenu }: CommunitiesListProps) {

    useEffect(() => {

    }, []);

    return <aside>
        <IonButton routerLink="/home/community/create" onClick={() => closeSideMenu()}>
            Create Community
        </IonButton>
    </aside>
}


export default CommunitiesList;