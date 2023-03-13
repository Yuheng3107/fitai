//Nextjs imports
import dynamic from "next/dynamic";
import Link from "next/link";

import React from "react";
import reportWebVitals from "../utils/reportWebVitals";

//component imports
import Navbar from "../components/navbar/Navbar";
import Main from "../components/main/Main";

//ionic imports
import { IonContent, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from "@ionic/react";

const IonFooter = dynamic(() => import('@ionic/react').then((m) => m.IonFooter), { ssr: false });

function Home() {
    return <IonPage>
        {/* <Navbar /> */}

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
                        <Link href="/profile">Profile</Link>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonFooter>
    </IonPage>
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default Home;

