import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonPopover,
    IonButton,
    IonImg,
    IonList,
    IonItem,
    IonLabel
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Cars.css';

import { UsedCarsSummary } from '../components/UsedCars';
import { IUrlOptions } from '../models/rest-api.model';
import { RemoteService } from './remote.service';
import User from "../assets/images/User.svg";

const UsedCarsPage = ({ cars, history }: any) => {
    const remoteService = new RemoteService();

    const getRecordById = (recordId: string) => {
        const options: IUrlOptions = {
            endPoint: ``,
            restOfUrl: '',
            isSecure: true,
            contentType: 'application/json'
        };

        remoteService.request('GET', options).then((data) => {
            console.log('Home data : ', data);
        })
    }

    useEffect(() => {
        let isLoggedIn = sessionStorage.getItem('userToken');
        if (!isLoggedIn) {
            history.push('/home');
        }
        getRecordById('2');
    }, []);

    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

    return (
        <IonPage>

            <IonHeader className="nav-header">
                <IonToolbar>
                    <IonMenuButton slot="start"></IonMenuButton>
                    <IonTitle>User Cars Analysis and Insights</IonTitle>
                </IonToolbar>
                <IonPopover
                    cssClass='my-custom-class'
                    event={popoverState.event}
                    isOpen={popoverState.showPopover}
                    onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                >
                    <IonList>
                        <IonItem>
                            <IonLabel>Settings</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </IonPopover>
                <IonImg src={User} className="user-icon" onClick={(e: any) => {e.persist(); setShowPopover({ showPopover: true, event: e }) }}/>
            </IonHeader>

            <IonContent class="ion-padding ion-custom-content" style={{"background":"#f2f2f2 !important"}}>
                <UsedCarsSummary cars={cars} />
            </IonContent>

        </IonPage>
    );
};

export default UsedCarsPage;
