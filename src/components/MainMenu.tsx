import React, { useState } from 'react';
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
    IonImg,
    IonItemGroup
} from '@ionic/react';
import { home,star, person,chatboxes, notifications, journal, calendar,create,radioButtonOff, squareOutline, navigate, settings, square , arrowDropdown} from 'ionicons/icons';
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
        { title: 'Insights', url: '/insight', icon: star},
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

    const [showForce, setShowForce] = useState(false);

    const menuItemForce = () => {
        setShowForce(!showForce);
      } 

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
                        {/* {
                            appPages.map((appPage, index) => {
                                return (
                                  
                             
                                   
                                );
                            })
                        } */}

                        <IonMenuToggle auto-hide="false" className="scroll">
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={home} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Home</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/insight" onClick={menuItemForce} lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={star} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Insights</IonLabel>
                                            <IonIcon icon={arrowDropdown} slot="end" style={{"marginRight":"12px"}}/>
                                        </IonItem>
                                            <IonItemGroup className={showForce === true ? "display" :"hide"}>
                                                <IonItem submenu-item  lines="none" class="remove_inner_bottom" style={{"height":"40px"}}>
                                                    <IonIcon icon="" slot="start" style={{"marginRight":"12px"}}/>
                                                    <IonLabel>Asset 360</IonLabel>
                                                </IonItem>
                                                <IonItem submenu-item  lines="none" class="remove_inner_bottom" style={{"height":"40px"}}>
                                                    <IonIcon icon="" slot="start" style={{"marginRight":"12px"}}/>
                                                    <IonLabel>Maintenance 360</IonLabel>
                                                </IonItem>
                                                <IonItem submenu-item  lines="none" class="remove_inner_bottom" style={{"height":"40px"}}>
                                                    <IonIcon icon="" slot="start" style={{"marginRight":"12px"}}/>
                                                    <IonLabel>Operations 360</IonLabel>
                                                </IonItem>
                                                <IonItem submenu-item  lines="none" class="remove_inner_bottom" style={{"height":"40px"}}>
                                                    <IonIcon icon="" slot="start" style={{"marginRight":"12px"}}/>
                                                    <IonLabel>Warehouse 360</IonLabel>
                                                </IonItem>
                                                <IonItem submenu-item  lines="none" class="remove_inner_bottom" style={{"height":"40px"}}>
                                                    <IonIcon icon="" slot="start" style={{"marginRight":"12px"}}/>
                                                    <IonLabel>Fixed Asset 360</IonLabel>
                                                </IonItem>
                                            </IonItemGroup>
                                        <IonItem routerLink="/workinstruction" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={person} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Work Instructions Authoring</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={chatboxes} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Chatter</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={notifications} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>IOT and Alerts</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={journal} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Maintenance Control Center</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={calendar} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Planning & Scheduling</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={create} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>ROI Forecasting</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={radioButtonOff} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Operator Rounds</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={squareOutline} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Paperless Operations</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={navigate} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Asset Tracker</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={settings} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Warehouse 360°</IonLabel>
                                        </IonItem>
                                        <IonItem routerLink="/home" lines="none" class="remove_inner_bottom">
                                            <IonIcon icon={settings} slot="start" style={{"marginRight":"12px"}}/>
                                            <IonLabel>Configure CWP</IonLabel>
                                        </IonItem>   
                                    </IonMenuToggle>
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
