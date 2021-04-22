import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { IonContent, IonHeader, IonGrid, IonImg, IonPage, IonTitle, IonList, IonLabel, IonToolbar, IonPopover, IonSearchbar, IonFooter, IonItem, IonButton, IonIcon, IonRow, IonCol } from '@ionic/react';
import { apps, home, send, add, download, copy, book, starOutline, document, backspace } from 'ionicons/icons';
import axios from 'axios';
import User from "../assets/images/User.svg";
import coverImage from "../assets/images/category-placeholder.png";
import docPlaceholder from "../assets/images/doc-placeholder.png";
import arrowDown from "../assets/images/caret-down.svg";
import Swal from 'sweetalert2';
import drafts from "../assets/data/draftedInstructions.json";
import favInstructions from "../assets/data/favoriteWI.json";
import categories from "../assets/data/categories.json";
import "./UsedCars.css";

export const InstructionSummary = () => {
    const [searchText, setSearchText] = useState("");
    const [draftedInstructions, setDraftedInstructions] = useState(drafts.data);
    const [favoriteIns, setFavoriteIns] = useState(favInstructions.data);
    const [categoriesArr, setcategoriesArr] = useState(categories.data);
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

    useEffect(() => {
        console.log(draftedInstructions);
        console.log(favoriteIns);
        console.log(categoriesArr);
    }, [draftedInstructions, favoriteIns, categoriesArr])

    return (
        <React.Fragment>
            <IonContent>
          <IonRow>
              <IonCol size="4">
              <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
            </IonCol>
              <IonCol size="8" style={{"text-align": "right"}}> 
              <IonButton style={{"width": "320px", "border-radius":"20px", "background-color": "dark-blue"}}><IonIcon style={{"font-size": "15px"}} icon={add} />Create New Work Instruction<IonImg style={{"width": "15px", "color": "#ffffff"}} src={arrowDown} onClick={(e: any) => { e.persist(); setShowPopover({ showPopover: true, event: e }) }} /> </IonButton>
              <IonPopover
                    cssClass='my-custom-class'
                    event={popoverState.event}
                    isOpen={popoverState.showPopover}
                    onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                >
                    <IonList>
                        <IonItem>
                            <IonLabel><IonIcon icon={download} />Import file</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon icon={copy} />Copy Work Instruction</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon icon={book} /> Download Template</IonLabel>
                        </IonItem>
                    </IonList>
                </IonPopover>

              </IonCol>
          </IonRow>
           
          <div style={{ "height": "15px", "background": "#f2f2f2" }}></div>

            
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonCol>
                                    <IonIcon style={{"font-size": "20px","padding-left": "-10px", "position":"relative","top":"5px"}} icon={document} />Drafts
                        </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    {draftedInstructions.map(draft => (
                                        draft.WI_Name ? (
                                            <IonList key={draft.Id}>  <IonImg style={{"width": "50px","height": "50px","float":"left","marginRight":"10px"}} src={docPlaceholder} className="docPlaceholder"/><IonLabel style={{"position": "relative","top": "10px"}}>{draft.WI_Name}</IonLabel></IonList>
                                        ) : null
                                    ))}

                                </IonCol>
                            </IonRow>
                        </IonCol>
                        <IonCol>
                            <IonRow>
                                <IonCol>
                                    <IonIcon style={{"font-size": "20px","padding-left": "-10px", "position":"relative","top":"3px"}} icon={starOutline} />Favorites
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    {favoriteIns.map(fav => (
                                        fav.WI_Name ? (
                                             <IonList key={fav.Id}>  <IonImg style={{"width": "50px","height": "50px","float":"left","marginRight":"10px"}} src={docPlaceholder} className="docPlaceholder"/><IonLabel style={{"position": "relative","top": "10px"}}>{fav.WI_Name}</IonLabel></IonList>
                                   
                                        ) : null
                                    ))}
                                </IonCol>
                            </IonRow>
                            </IonCol>
                    </IonRow>

                </IonGrid>

                <div style={{ "height": "15px", "background": "#f2f2f2" }}></div>
<IonRow>
                {categoriesArr.map(cat => (
                   cat.Category_Name ? (<IonCol size="3" key={cat.Category_Id} >
                              <IonImg src={coverImage} className="coverimg"/>
                        <IonLabel>{cat.Category_Name}</IonLabel>   
                      
                        </IonCol>): null       
                ))}     
                </IonRow>       

            </IonContent>
        </React.Fragment>
    );
}

















