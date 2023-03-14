//Nextjs imports
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/future/image";

import React from "react";

//component imports

import personUnfilled from '../../public/assets/svg/person_unfilled.svg';

//ionic imports
import {
    IonApp,
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTab,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel

} from "@ionic/react";
import { cog, flash, list } from 'ionicons/icons';

const IonFooter = dynamic(() => import('@ionic/react').then((m) => m.IonFooter), { ssr: false });


function Layout(props) {
    return <IonApp>
        <IonPage>
            {props.children}
            <IonFooter>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton>persisting</IonButton>
                    </IonButtons>
                    <IonButtons slot="primary">
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton>
                            <Link href="/profile">
                                <Image src={personUnfilled} alt="profile icon" ></Image>
                            </Link>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    </IonApp>

}

export default Layout