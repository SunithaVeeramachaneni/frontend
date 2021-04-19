import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import { Doughnut, Bar } from 'react-chartjs-2';
import {
    IonGrid,
    IonRow, IonCol, IonContent,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonHeader,
    IonModal,
    IonSearchbar,
    IonButton,
    IonItem, IonLabel, IonInput, IonImg,
    IonPage,
    IonTitle,
    useIonViewWillEnter,
    IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/react';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';

import Close from "../assets/images/close.svg";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";

import Swal from 'sweetalert2';

import "./UsedCars.css";

export const UsedCarsInsightsSummary = ({ cars }: any) => {
    const [items, setItems] =useState([] as any);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    const [responseTime, setResponseTime] = useState("");
    const [instructions, setInstructions] = useState([] as any);
    const [newCarsByModel, setNewCarsByModel] = useState([] as any);
    const [newCarsByModelAndYear, setNewCarsByModelAndYear] = useState([] as any);

    const [skip, setSkip] = useState(0)
    const [count, setCount] = useState(1)
    const [searchText, setSearchText] = useState("")


    const [usedCars, setUsedCars]= useState([] as any);
  
    const fetchMoreData = () => {
        setSkip(instructions.length)
        setCount(count => count + 1);
    }

    const fetchMoreUsedCarsData = () => {
        setSkip(usedCars.length)
        setCount(count => count + 1);
    }

    async function fetchData(skippped) {
        const url: string = `https://invamdemo-dbapi.innovapptive.com/cars?skip=${skip}`;    
        const res: Response = await fetch(url);
        res
            .json()
            .then(async (res) => {
              if (res && res.usedcars && res.usedcars.length > 0) {
                setItems([...items, ...res.usedcars]);
                setDisableInfiniteScroll(res.usedcars.length < 10);
              } else {
                setDisableInfiniteScroll(true);
              }
            })
            .catch(err => console.error(err));
      }

      useIonViewWillEnter(async () => {
        await fetchData(0);
      });

      
      async function searchNext($event: CustomEvent<void>) {
          setSkip(skip => skip + 10)
          setCount(count => count + usedCars.length)
        await fetchData(skip);
    
        ($event.target as HTMLIonInfiniteScrollElement).complete();
      }

    useEffect(() => {
        let searchedResult = usedCars.filter(function(car){
            return car.make == searchText || car.model == searchText ;
        });
        console.log(searchedResult);
        if(searchedResult.length > 0) {
            setUsedCars(searchedResult);
        } else {
                 // http://cwpdev.innovapptive.com:3000/cars?skip=${skip}
            const fetchCars = async () => {
                try {
                    const results = await axios('https://invamdemo-dbapi.innovapptive.com/cars?skip=${skip}', {
                      method: 'get',
                      withCredentials: false
                   });
                   console.log(results);
                   setUsedCars(results.data.usedcars);
        
                } catch(error) {
                    console.log(error);
                  };
            }
           
            fetchCars();
        }

    }, [searchText])


    useEffect(() => {
        const fetchCars = async () => {
            try {
                const results = await axios('https://invamdemo-dbapi.innovapptive.com/cars?skip=${skip}', {
                  method: 'get',
                  withCredentials: false
               });
               console.log(results);
                        setUsedCars(results.data.usedcars);
    
            } catch(error) {
                console.log(error);
              };
        }

     fetchCars();


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
        axios.post('https://invamdemo-dbapi.innovapptive.com/car', {
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
          axios.put(`https://invamdemo-dbapi.innovapptive.com/updateCar/${data.id}`, {
                model_name:data.model_name,
                make_name: data.make_name,
                body_type: data.body_type,
                city: data.city,
                engine_type: data.engine_type
          })
          .then((response) => {
            console.log(response);
            setShowEditModal(false);

            //TODO - Should improve code here for multiple calls
            const carsPromise = axios('https://invamdemo-dbapi.innovapptive.com/cars?skip=${skip}', {
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
                    let cars = res.data.usedcars
                    setUsedCars(cars);

                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Successfully'
                    })
                })
                .catch(error => {
                    console.log(error);
                });


          }, (error) => {
            console.log(error);
          });
    }

    const deleteUsedCars = (cars) => {
        axios.delete(`https://invamdemo-dbapi.innovapptive.com/deleteCar/${cars.id}`).then(res => {
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
            <IonToolbar>
                <IonSearchbar placeholder="Search by makename or model name" value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
            </IonToolbar>

            <IonButton onClick={() => setShowModal(true)} style={{"position":"absolute","right":"10px"}}>ADD</IonButton>
           
           
            <IonGrid style={{"marginTop":"50px"}}>
                <IonHeader>
                    <IonRow>
                        <IonCol className="bold borders">Model Name</IonCol>
                        <IonCol className="bold borders">Make Name</IonCol>
                        <IonCol className="bold borders">City</IonCol>
                        <IonCol className="bold borders">Engine</IonCol>
                       
                    </IonRow>
                </IonHeader>
                {items.map(car => (
                    
                    car.model ?  (<IonRow key={car.id}>                    
                        <IonCol className="borders">{car.model}</IonCol>
                        <IonCol className="borders">{car.make}</IonCol>
                          <IonCol className="borders">{car.city}</IonCol>
                        <IonCol className="borders">{car.engine_type}</IonCol>
                       
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

                  </IonRow>): null                
                  
                ))}
                    <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                        onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                        <IonInfiniteScrollContent
                            loadingText="Loading more UsedCars...">
                        </IonInfiniteScrollContent>
                    </IonInfiniteScroll>

                </IonGrid>
              </IonContent>
        </React.Fragment>
    );
}

















