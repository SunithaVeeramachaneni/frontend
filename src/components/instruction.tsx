import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { IonModal,IonInput, IonContent, IonHeader, IonGrid, IonImg, IonPage, IonTitle, IonList, IonLabel, IonToolbar, IonPopover, IonSearchbar, IonFooter, IonItem, IonButton, IonIcon, IonRow, IonCol ,IonBadge} from '@ionic/react';
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
import "./instructions.css";

import Close from "../assets/images/close.svg";

import { Controller, useForm } from 'react-hook-form';

import { star} from 'ionicons/icons';

export const InstructionSummary = () => {
    const [searchText, setSearchText] = useState("");
    const [draftedInstructions, setDraftedInstructions] = useState(drafts.data);
    const [favoriteIns, setFavoriteIns] = useState(favInstructions.data);
    const [categoriesArr, setcategoriesArr] = useState(categories.data);
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

    const { register, handleSubmit, errors } = useForm({}); 
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle]= useState("");

    useEffect(() => {
        console.log(draftedInstructions);
        console.log(favoriteIns);
        console.log(categoriesArr);
    }, [draftedInstructions, favoriteIns, categoriesArr])

    const onSubmit = data => {
        console.log(data)
    }

    return (
        <React.Fragment>
            <IonContent>
          <IonRow>
              <IonCol size="4">
              <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
            </IonCol>
              <IonCol size="8" style={{"textAlign": "right"}}> 
              <IonButton style={{"width": "320px", "borderRadius":"20px", "backgroundColor": "dark-blue"}}><IonIcon style={{"fontSize": "15px"}} icon={add} />Create New Work Instruction<IonImg style={{"width": "15px", "color": "#ffffff"}} src={arrowDown} onClick={(e: any) => { e.persist(); setShowPopover({ showPopover: true, event: e }) }} /> </IonButton>
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
                                    <IonIcon style={{"fontSize": "20px","paddingLeft": "-10px", "position":"relative","top":"5px"}} icon={document} />
                                    <IonLabel style={{"fontWeight":"600","fontSize":"16px"}}>Drafts</IonLabel>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol style={{"maxWidth":"60px"}}>
                                    {draftedInstructions.map(draft => (
                                        draft.WI_Name ? (
                                            <IonList key={draft.Id}>  
                                                <IonImg style={{"width": "50px","height": "50px","float":"left","marginRight":"10px"}} src={docPlaceholder} className="docPlaceholder"/>
                                           </IonList>
                                        ) : null
                                    ))}

                                </IonCol>
                                <IonCol>
                                    {draftedInstructions.map(draft => (
                                        draft.WI_Name ? (
                                            <IonList key={draft.Id}> 
                                            <IonLabel style={{"position": "relative","top": "10px"}}><div className="ellipsis">{draft.WI_Name}</div></IonLabel><br/>
                                            <IonLabel style={{"position": "relative","top": "10px"}}>{JSON.parse(draft.Categories).Category_Name}</IonLabel>
                                           </IonList>
                                           
                                        ) : null
                                    ))}

                                </IonCol>
                                <IonCol>
                                    {draftedInstructions.map(draft => (
                                        draft.EditedBy ? (
                                            <IonList key={draft.Id}>
                                                <IonLabel style={{"position": "relative","top": "10px"}}>Edited 8 days ago <br/> by {draft.EditedBy}</IonLabel>
                                            </IonList>
                                        ) : null
                                    ))}
                                </IonCol>
                            </IonRow>
                        </IonCol>
                        <IonCol>
                            <IonRow>
                                <IonCol>
                                    <IonIcon style={{"fontSize": "20px","paddingLeft": "-10px", "position":"relative","top":"3px"}} icon={starOutline} />
                                    <IonLabel style={{"fontWeight":"600","fontSize":"16px"}}>Favorites</IonLabel>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol  style={{"maxWidth":"60px"}}>
                                    {favoriteIns.map(fav => (
                                        fav.WI_Name ? (
                                             <IonList key={fav.Id}>  <IonImg style={{"width": "50px","height": "50px","float":"left","marginRight":"10px"}} src={docPlaceholder} className="docPlaceholder"/></IonList>
                                   
                                        ) : null
                                    ))}
                                </IonCol>
                                <IonCol>
                                    {favoriteIns.map(fav => (
                                        fav.WI_Name ? (
                                             <IonList key={fav.Id} style={{"display":"flex"}}> 
                                                <IonLabel style={{"position": "relative","top": "10px"}}><div className="ellipsis">{fav.WI_Name}</div> </IonLabel>
                                                <IonIcon icon={star} slot="start" color="yellow"/>
                                                <IonBadge color="medium" style={{"width":"40px"}} className={fav.Published===0 ? "display" : "hide"}>Draft</IonBadge></IonList>
                                   
                                        ) : null
                                    ))}
                                </IonCol>
                                <IonCol>
                                    {favoriteIns.map(fav => (
                                        fav.EditedBy ? (
                                             <IonList key={fav.Id}> <IonLabel style={{"position": "relative","top": "10px"}}>Edited 8 days ago <br/> by {fav.EditedBy}</IonLabel></IonList>
                                   
                                        ) : null
                                    ))}
                                </IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol style={{"textAlign":"center"}}><a href="workinstructions/drafts">SEE ALL</a></IonCol>
                        <IonCol style={{"textAlign":"center"}}>SEE ALL</IonCol>
                    </IonRow>

                </IonGrid>

                <div style={{ "height": "15px", "background": "#f2f2f2" }}></div>
                <IonRow>
                    <IonCol style={{"fontWeight":"600","fontSize":"16px"}}>Categories</IonCol>
                    <IonCol><IonButton data-target="#addModal" style={{"float":"right"}} onClick={() => setShowModal(true)}><IonIcon style={{"fontSize": "15px"}} icon={add} />ADD CATEGORY</IonButton></IonCol>
                    <IonModal isOpen={showModal} cssClass='my-custom-class' id="addModal">
                        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 18 }}>
                        <h1 style={{"marginTop":"0px"}}>Add
                            <IonImg src={Close} className="Logo" onClick={() => setShowModal(false)} style={{"cursor":"pointer","width":"60px","float":"right"}}/></h1>
                        <hr style={{"background":"lightgray"}}/>
                        <IonItem lines="none" class="remove_inner_bottom">
                            <IonLabel className="form-labels">Title</IonLabel>
                            <IonInput name="model_name" value={title} className="form-inputs" onIonChange={e => setTitle(e.detail.value!)} ref={register({required: true})}></IonInput>
                        </IonItem>
                        <IonButton type="submit">
                            Submit
                        </IonButton>
                    </form>
             </IonModal>
      
          
           
                </IonRow>
                <IonRow>
                {categoriesArr.map(cat => (
                   cat.Category_Name ? (<IonCol size="4" key={cat.Category_Id} >
                              <IonImg src={coverImage} className="coverimg"/>
                        <IonLabel style={{"fontWeight":"600","fontSize":"16px"}}>{cat.Category_Name}</IonLabel>   <br/>
                        <IonLabel>0 Drafted - 1 Published</IonLabel>   
                      
                        </IonCol>): null       
                ))}     
                </IonRow>       

            </IonContent>
        </React.Fragment>
    );
}

















