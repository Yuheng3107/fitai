//Nextjs imports
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/future/image";

import React from "react";
import reportWebVitals from "../utils/reportWebVitals";

//component imports
import Navbar from "../components/navbar/Navbar";
import Main from "../components/main/Main";

import personUnfilled from '../public/assets/svg/person_unfilled.svg';

//ionic imports
import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon
} from "@ionic/react";

const IonFooter = dynamic(() => import('@ionic/react').then((m) => m.IonFooter), { ssr: false });


function Layout(props) => {
    return <IonPage>
        <IonContent>
            <Main />
        </IonContent>
        <IonFooter>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton>Start</IonButton>
                </IonButtons>
                <IonTitle>Buttons</IonTitle>
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
}

export default Layout