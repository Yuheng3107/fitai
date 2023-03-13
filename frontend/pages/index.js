import dynamic from "next/dynamic";
import Image from "next/image";

import React from "react";
import App from "./App";
import reportWebVitals from "../utils/reportWebVitals";

import Navbar from "../components/navbar/Navbar";
import Main from "../components/main/Main";
import { IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const IonFooter = dynamic(() => import('@ionic/react').then((m) => m.IonFooter), { ssr: false });

function Home() {
    return <IonPage>
        {/* <Navbar /> */}

        <IonContent>
            <Main />
        </IonContent>
        <IonFooter>
            <IonToolbar>
                <IonTitle>This is a footer</IonTitle>
            </IonToolbar>
        </IonFooter>
    </IonPage>
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default Home;

