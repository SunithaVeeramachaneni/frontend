import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonMenuToggle,
    IonLabel,
    IonFooter,
    IonImg
} from '@ionic/react';
import { home,star, person,chatboxes, notifications, journal, calendar,create,radioButtonOff, squareOutline, navigate, settings, square } from 'ionicons/icons';
import Logo from "../assets/images/innovapptive-logo.svg";
import "./MainMenu.css";

interface AppPage {
    title: string,
    url: string,
    icon: any
}

export const MainMenu = ({ disabled }: any) => {
    let history = useHistory();
    console.log('history :', history);
    const appPages: AppPage[] = [
        { title: 'Dashboard', url: '/home', icon: home },
        { title: 'Insights', url: '/insight', icon: star },
        { title: 'Work Instructions Authoring', url: '/workInstructions', icon: person },
        { title: 'Chatter', url: '/home', icon: chatboxes },
        { title: 'IOT and Alerts', url: '/home', icon: notifications },
        { title: 'Maintenance Control Center', url: '/home', icon: journal },
        { title: 'Planning & Scheduling', url: '/home', icon: calendar },
        { title: 'ROI Forecasting', url: '/home', icon: create },
        { title: 'Operator Rounds', url: '/home', icon: radioButtonOff },
        { title: 'Paperless Operations', url: '/home', icon: squareOutline },
        { title: 'Asset Tracker', url: '/home', icon: navigate },
        { title: 'Warehouse 360°', url: '/home', icon: settings },
        { title: 'Configure CWP', url: '/home', icon: settings },

    ];

    return (
        <React.Fragment>
            <IonMenu menuId="first" className="menu-width" contentId="myMenuOutlet" disabled={disabled}>
                <IonHeader>
                    <IonToolbar>
                        <IonImg src={Logo} className="Logo"/>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {
                            appPages.map((appPage, index) => {
                                return (
                                    <IonMenuToggle key={index} auto-hide="false" className="scroll">
                                        <IonItem routerLink={appPage.url} lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={appPage.icon} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>{appPage.title}</IonLabel>
                                        </IonItem>
                                    </IonMenuToggle>
                                );
                            })
                        }
                        <IonMenuToggle key={5} auto-hide="false" onClick={() => {
                            sessionStorage.removeItem('userToken');
                            history.push('/home')
                        }}>
                            {/* <IonItem no-lines>
                                <IonIcon icon={settings} slot="start" style={{"marginRight":"12px"}} />
                                <IonLabel>Logout</IonLabel>
                            </IonItem> */}
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
                <IonFooter className="footer">
                    <p className="footer-text">Connected Worker Platform</p>
                    <p className="footer-text">2020 All Rights Reserved</p>
                    <p className="footer-text" style={{"display":"flex"}}><br />
                        <span>Powered by </span><IonImg src={Logo} className="footer-logo"/></p>
                </IonFooter>
            </IonMenu>
        </React.Fragment>
    )
}
