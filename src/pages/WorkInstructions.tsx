import React from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent } from '@ionic/react';
import { InstructionSummary } from '../components/instruction';

const WorkInstructionPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>WorkInstructions</IonTitle>

                </IonToolbar>
            </IonHeader>
                <IonContent class="ion-padding">
                <InstructionSummary  />
            </IonContent>
        </IonPage>
    );
};

export default WorkInstructionPage;