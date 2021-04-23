import React, { useEffect } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonSplitPane,
    IonPage
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { apps, home, send } from 'ionicons/icons';

import Insight from './pages/Insight';
import WorkInstructionPage from './pages/WorkInstructions';
import UsedCarsPage from './pages/Cars';
import './vendor';

import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import { MainMenu } from './components/MainMenu';
import LeaveDetails from './components/LeaveDetails';
import ApplyLeaveForm from './components/ApplyLeaveForm';
import * as Users from './assets/data/leaves.json';
import "./App.css";
const App: React.FC = (props) => {
    const { data }: any = Users;

    useEffect(() => {
        console.log('Users :', data)
    }, []);

    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="myMenuOutlet">
                    <MainMenu className="menu-width" disabled={false} />

                    <IonPage id="myMenuOutlet">

                        {/*<IonTabs> */}
                            <IonRouterOutlet>
                                <Route path="/" render={(props) => <HomePage users={data} {...props} />} exact={true} />
                                {/* <Route path="/login" component={LoginPage} exact={true} /> */}
                                <Route path="/home" render={(props) => <HomePage users={data} {...props} />} exact={true} />
                                <Route path="/insight" component={Insight} exact={true} />
                                <Route path="/details/:leaveType/apply" component={ApplyLeaveForm} />
                                <Route path="/details/:leaveType" component={LeaveDetails} />

                                {/* <Route path="/tab2/details" component={Details} /> */}
                                <Route path="/workinstructions" component={WorkInstructionPage} />
                                <Route path="/usedcars" component={UsedCarsPage} />
                                <Route exact path="/" render={() => <Redirect to="/home" />} />
                            </IonRouterOutlet>



                    </IonPage>

                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;
