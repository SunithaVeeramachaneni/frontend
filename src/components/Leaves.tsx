import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {
    IonGrid,
    IonRow, IonCol, IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonHeader,
    IonModal,
    IonButton,
    IonItem, IonLabel, IonInput, IonImg
} from '@ionic/react';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';
 
import Close from "../assets/images/close.svg";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";

import Swal from 'sweetalert2';

import "./Leaves.css";

export const LeavesSummary = ({ users }: any) => {
    
    // axios.interceptors.request.use(x => {
    //     x.meta = x.meta || {}
    //     x.meta.requestStartedAt = new Date().getTime();
    //     return x;
    // });
    
    const [responseTime, setResponseTime] = useState("");
    const [instructions, setInstructions] = useState([] as any);
    const [skip, setSkip] = useState(0)
    const [count, setCount] = useState(1)

    const [usedCars, setUsedCars]= useState([] as any);
    // const [pageNoCars, setPageNoCars]= useState(1);
    // const [countCars, setCountCars]= useState(30);

    const fetchMoreData = () => {
        setSkip(instructions.length)
        setCount(count => count + 1);
    }

    const fetchMoreUsedCarsData = () => {
        setSkip(usedCars.length)
        setCount(count => count + 1);
    }

    useEffect(() => {
       
        try {
            const carsPromise = axios('http://localhost:3000/cars?skip=${skip}', {
              method: 'get',
              withCredentials: false,
                headers: {
                  'Accept': 'application/json',
                  'sec-fetch-mode': 'no-cors',
                  'Access-Control-Allow-Origin': '*'
                }
              });
            
            // const data = response.data;
              carsPromise.then((res) => {
                    console.log(res.data);
                    const cars = res.data.usedcars
                    setUsedCars([...usedCars, ...cars]);
                    
                })
                .catch(error => {
                    console.log(error);
                });
                
        } catch(error) {
            console.log(error);       
          };
      
     
    }, [skip])

    const { register, handleSubmit, errors } = useForm({}); // initialise the hook


    const [id, setId] = useState("")
    const [model_name, setModelName]= useState("Range Rover Velar");
    const [make_name, setMakeName]= useState("Land Rover")
    const [body_type, setBodyType]= useState("Sedan")
    const [city, setCity]= useState("San Juan")
    const [engine_type, setEngineType]= useState("I4")

    const showDetails =async data => {
        console.log(data);
        setId(data.id);
        setModelName(data.model);
        setMakeName(data.make);
        setBodyType(data.body_type);
        setCity(data.city);
        setEngineType(data.engine_type);
    }

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const onSubmit = data => {
          console.log(data)
        axios.post('http://localhost:3000/car', {
            model_name: data.model_name,
            make_name: data.make_name,
            body_type: data.body_type,
            city: data.city,
            engine_type: data.engine_type
          })
          .then((response) => {
            console.log(response);
            setShowModal(false)
            Swal.fire({
                icon: 'success',
                title: 'Added Successfully'
            })
          }, (error) => {
            console.log(error);
          });
      };

      const updateUsedCars = data => {
          console.log(data);
          axios.put(`http://localhost:3000/updateCar/${data.id}`, {
                model_name:data.model_name,
                make_name: data.make_name,
                body_type: data.body_type,
                city: data.city,
                engine_type: data.engine_type
          })
          .then((response) => {
            console.log(response);
            setShowEditModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully'
            })
          }, (error) => {
            console.log(error);
          });
    }

    const deleteUsedCars = (cars) => {
        axios.delete(`http://localhost:3000/deleteCar/${cars.id}`).then(res => {
          Swal.fire({
              icon: 'success',
              title: 'Deleted Successfully'
          })
          const usedcar = usedCars.filter(item => item.id !== cars.id);
          setUsedCars(usedcar);
        })
    }

    return (
        <React.Fragment>
             <IonContent>
             <IonModal isOpen={showModal} cssClass='my-custom-class'>
             <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 18 }}>
                <h1 style={{"marginTop":"0px"}}>Add  
                    <IonImg src={Close} className="Logo" onClick={() => setShowModal(false)} style={{"cursor":"pointer","width":"60px","float":"right"}}/></h1>
                <hr style={{"background":"lightgray"}}/>
                <IonItem lines="none" class="remove_inner_bottom">
                    <IonLabel className="form-labels">Model</IonLabel>
                    <IonInput name="model_name" value={model_name} className="form-inputs" onIonChange={e => setModelName(e.detail.value!)} ref={register({required: true})}></IonInput>
                </IonItem>

                <IonItem lines="none" class="remove_inner_bottom">
                    <IonLabel className="form-labels">Make</IonLabel>
                    <IonInput name="make_name" value={make_name} className="form-inputs" onIonChange={e => setMakeName(e.detail.value!)} ref={register({required: true})}></IonInput>
                </IonItem>

                <IonItem lines="none" class="remove_inner_bottom">
                    <IonLabel className="form-labels">Body Type</IonLabel>
                    <IonInput name="body_type" value={body_type} className="form-inputs" onIonChange={e => setBodyType(e.detail.value!)} ref={register({required: true})}></IonInput>
                </IonItem>

                <IonItem lines="none" class="remove_inner_bottom">
                    <IonLabel className="form-labels">City</IonLabel>
                    <IonInput name="city" value={city} className="form-inputs" onIonChange={e => setCity(e.detail.value!)} ref={register({required: true})}></IonInput>
                </IonItem>

                <IonItem lines="none" class="remove_inner_bottom">
                    <IonLabel className="form-labels">Engine</IonLabel>
                    <IonInput name="engine_type" value={engine_type} className="form-inputs" onIonChange={e => setEngineType(e.detail.value!)} ref={register({required: true})}></IonInput>
                </IonItem>

                <IonButton type="submit">
                    Submit
                </IonButton>
            </form>
                </IonModal>
                <IonButton onClick={() => setShowModal(true)} style={{"position":"absolute","right":"10px"}}>ADD</IonButton>
                <IonGrid style={{"marginTop":"50px"}}>
                <IonHeader>
                    <IonRow>
                        <IonCol className="bold borders">Model Name</IonCol>
                        <IonCol className="bold borders">Make Name</IonCol>
                        <IonCol className="bold borders">Body Type</IonCol>
                        <IonCol className="bold borders">City</IonCol>
                        <IonCol className="bold borders">Engine Type</IonCol>
                        <IonCol className="borders"></IonCol>
                        </IonRow>
                </IonHeader>
                {usedCars.map(car => (
                    <IonRow key={car.id} >
                        <IonCol className="borders">{car.model}</IonCol>
                        <IonCol className="borders">{car.make}</IonCol>
                        <IonCol className="borders">{car.body_type}</IonCol>
                        <IonCol className="borders">{car.city}</IonCol>
                        <IonCol className="borders">{car.engine_type}</IonCol>
                        <IonCol className="borders">
                            <IonModal isOpen={showEditModal} cssClass='my-custom-class'>
                            <form onSubmit={handleSubmit(updateUsedCars)} style={{ padding: 18 }}>
                                <h1 style={{"marginTop":"0px"}}>Edit  
                                    <IonImg src={Close} className="Logo" onClick={() => setShowEditModal(false)} style={{"cursor":"pointer","width":"60px","float":"right"}}/></h1>
                                <hr style={{"background":"lightgray"}}/>

                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">Id</IonLabel>
                                    <IonInput name="id" value={id} className="form-inputs" ref={register({required: true})} disabled={true}></IonInput>
                                </IonItem>
                            
                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">Model</IonLabel>
                                    <IonInput name="model_name" value={model_name} className="form-inputs" onIonChange={e => setModelName(e.detail.value!)} ref={register({required: true})}></IonInput>
                                </IonItem>

                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">Make</IonLabel>
                                    <IonInput name="make_name" value={make_name} className="form-inputs" onIonChange={e => setMakeName(e.detail.value!)} ref={register({required: true})}></IonInput>
                                </IonItem>

                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">Body Type</IonLabel>
                                    <IonInput name="body_type" value={body_type} className="form-inputs" onIonChange={e => setBodyType(e.detail.value!)} ref={register({required: true})}></IonInput>
                                </IonItem>

                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">City</IonLabel>
                                    <IonInput name="city" value={city} className="form-inputs" onIonChange={e => setCity(e.detail.value!)} ref={register({required: true})}></IonInput>
                                </IonItem>

                                <IonItem lines="none" class="remove_inner_bottom">
                                    <IonLabel className="form-labels">Engine</IonLabel>
                                    <IonInput name="engine_type" value={engine_type} className="form-inputs" onIonChange={e => setEngineType(e.detail.value!)} ref={register({required: true})}></IonInput>
                                </IonItem>
                             
                                <IonButton type="submit">
                                    Submit
                                </IonButton>
                            </form>
                        </IonModal>
                        
                            <IonItem lines="none" class="remove_inner_bottom">
                                <IonImg src={Edit} onClick={() => {setShowEditModal(true); showDetails(car)}} style={{"width":"20px","cursor":"pointer"}} />  
                                <IonImg src={Delete} style={{"width":"20px","cursor":"pointer","marginLeft":"20px"}} onClick={() => deleteUsedCars(car)}/>
                            </IonItem>
                   
                        </IonCol>
                  </IonRow>
                ))}
                </IonGrid>
              </IonContent>
        </React.Fragment>
    );
}

















