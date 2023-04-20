import { IonButton } from "@ionic/react";
import { useEffect } from "react";
type CommunitiesListProps = {
    closeSideMenu: () => Promise<boolean>;
}
function CommunitiesList({ closeSideMenu }: CommunitiesListProps) {

    useEffect(() => {

    }, []);

    return <aside>
        <IonButton routerLink="/community/create">
            Create Community
        </IonButton>
    </aside>
}


export default CommunitiesList;