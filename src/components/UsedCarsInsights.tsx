import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import { Doughnut, Bar } from 'react-chartjs-2';
import {
    IonGrid,
    IonRow, IonCol, IonContent,
    IonToolbar,
    IonCard,
    IonLoading,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonHeader,
    IonSelect,
    IonSelectOption,
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
    const [showLoading, setShowLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [selectedMakeName, setSelectedMakeName] = useState("")
    const [selectedModelName, setSelectedModelName] = useState("")
    const [searchObject, setSearchObject] = useState({
        "make_name":"",
        "model_name":"",
        "city": "",
        "year": ""
      
    })

    const [usedCars, setUsedCars]= useState([] as any);

    const fetchMoreData = () => {
        setSkip(instructions.length)
        setCount(count => count + 1);
    }

    const fetchMoreUsedCarsData = () => {
        setSkip(usedCars.length)
        setCount(count => count + 1);
    }


    function delet(obj) {
        for (var prop in obj) {
            if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
                delete obj[prop];
            }
        }
    }

    const searchFields = async (searchObject) => {
        delet(searchObject);
        console.log(searchObject);
        let stringfiedSearch = JSON.stringify(searchObject);
        console.log(stringfiedSearch);

        const searchResults = await axios(`https://invamdemo-dbapi.innovapptive.com/search?page=1&limit=10&searchfeilds=${stringfiedSearch}`, {
            method: 'get',
            withCredentials: false
        });
        console.log(searchResults);
        if(searchResults) {
            console.log(searchResults);
            setItems(searchResults.data.usedcars)
        }
    
    }

    async function fetchData(skip) {
        const url: string = `https://invamdemo-dbapi.innovapptive.com/cars?skip=${skip}`;
        const res: Response = await fetch(url);
        setShowLoading(true);
        res
            .json()
            .then(async (res) => {
              if (res && res.usedcars && res.usedcars.length > 0) {
                setItems([...items, ...res.usedcars]);
                setShowLoading(false);
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
          axios.get(`https://invamdemo-dbapi.innovapptive.com/car/${data.id}`)
          .then((response) => {
              console.log(response);
          
            axios.put(`https://invamdemo-dbapi.innovapptive.com/updateCar/${data.id}`, {
                model_name:data.model_name,
                make_name: data.make_name,
                body_type: data.body_type,
                city: data.city,
                engine_type: data.engine_type,
                back_legroom: response.data.back_legroom,
                daysonmarket: response.data.daysonmarket,
                dealer_zip:  response.data.dealer_zip,
                engine_cylinders:  response.data.engine_cylinders,
                engine_displacement: response.data.engine_displacement,
                exterior_color: response.data.exterior_color,
                franchise_dealer: response.data.franchise_dealer,
                franchise_make:  response.data.franchise_make,
                front_legroom:  response.data.front_legroom,
                fuel_tank_volume:  response.data.fuel_tank_volume,
                fuel_type:  response.data.fuel_type,
                height: response.data.height,
                horsepower:  response.data.horsepower,
                interior_color:  response.data.interior_color,
                is_new: response.data.is_new,
                latitude:  response.data.latitude,
                length:  response.data.length,
                listed_date:  response.data.listed_date,
                listing_color: response.data.listing_color,
                longitude:  response.data.longitude,
                main_picture_url:  response.data.main_picture_url,
                major_options: response.data.major_options,
                maximum_seating:  response.data.maximum_seating,
                mileage:  response.data.mileage,
                power:  response.data.power,
                price:  response.data.price,
                savings_amount: response.data.savings_amount,
                seller_rating: response.data.seller_rating,
                sp_id: response.data.sp_id,
                sp_name: response.data.sp_name,
                torque: response.data.torque,
                transmission: response.data.transmission,
                transmission_display: response.data.transmission_display,
                trimId: response.data.trimId,
                trim_name: response.data.trim_name,
                vin: response.data.vin,
                wheel_system: response.data.wheel_system,
                wheel_system_display: response.data.wheel_system_display,
                wheelbase: response.data.wheelbase,
                width: response.data.width,
                year: response.data.year
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
                    setItems(cars);

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

        })
    }

    const deleteUsedCars = (selectedCar) => {
        axios.delete(`https://invamdemo-dbapi.innovapptive.com/deleteCar/${selectedCar.id}`).then(res => {
          Swal.fire({
              icon: 'success',
              title: 'Deleted Successfully'
          })
          const usedcar = items.filter(item => item.id !== selectedCar.id);
          
           setItems(usedcar);
        })
    }

    return (
        <React.Fragment>
             <IonContent>
             <IonLoading
                                    isOpen={showLoading}
                                    onDidDismiss={() => setShowLoading(false)}
                                    message={'Please wait...'}
                                    duration={5000}
                                    />
                 <IonSelect style={{"width" : "200px","border":"1px solid #E5E5E5","borderRadius":"10px"}} multiple={true}
                            interface="popover"
                            value={searchText}
                            placeholder="Select fields to search"
                            onIonChange={e => setSearchText(e.detail.value)}>
                     <IonSelectOption value="make_name">Make Name</IonSelectOption>
                     <IonSelectOption value="model_name">Model Name</IonSelectOption>
                     <IonSelectOption value="city">City</IonSelectOption>
                     <IonSelectOption value="year">Year</IonSelectOption>
                 </IonSelect>


                 <IonItem className={searchText ? "display" : "hide"} lines="none" class="remove_inner_bottom" style={{"marginTop":"10px","marginLeft":"-30px"}}>
                    <IonItem className={searchText.indexOf('make_name') !== -1 ? "display" : "hide"}  lines="none" class="remove_inner_bottom">
                        <IonLabel className="m-r-10">Make Name</IonLabel>
                        <IonInput value={searchObject.make_name} className="input-fields"  onIonChange={e => setSearchObject({...searchObject , "make_name":e.detail.value!})}></IonInput>
                    </IonItem>
                    <IonItem className={searchText.indexOf('model_name') !== -1 ? "display" : "hide"}  lines="none" class="remove_inner_bottom">
                        <IonLabel className="m-r-10">Model Name</IonLabel>
                        <IonInput value={searchObject.model_name} className="input-fields"  onIonChange={e => setSearchObject({...searchObject , "model_name":e.detail.value!})}></IonInput>
                    </IonItem>
                    <IonItem className={searchText.indexOf('city') !== -1 ? "display" : "hide"}  lines="none" class="remove_inner_bottom">
                        <IonLabel className="m-r-10">city</IonLabel>
                        <IonInput value={searchObject.city} className="input-fields"  onIonChange={e => setSearchObject({...searchObject , "city":e.detail.value!})}></IonInput>
                    </IonItem>
                    <IonItem className={searchText.indexOf('year') !== -1 ? "display" : "hide"}  lines="none" class="remove_inner_bottom">
                        <IonLabel className="m-r-10">Year</IonLabel>
                        <IonInput value={searchObject.year} className="input-fields"  onIonChange={e => setSearchObject({...searchObject , "year":e.detail.value!})}></IonInput>
                    </IonItem>
                    <IonItem lines="none" class="remove_inner_bottom">
                        <IonButton onClick={() => searchFields(searchObject)}   
                               className={searchText ? "display" : "hide"} style={{"height":"40px"}}>Search</IonButton>
                    </IonItem>
                  
                 </IonItem>
              
          {/* <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                             onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent
                loadingText="Loading more usedcars...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll> */}

             <IonModal isOpen={showModal} cssClass='my-custom-class' id="addModal">
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
      
            <IonButton data-target="#addModal" onClick={() => setShowModal(true)} style={{"position":"absolute","right":"10px"}}>ADD</IonButton>
           <div style={{"clear": "both"}}> </div>
           <br /><br /> 
            <IonGrid style={{"marginTop":"5px"}}>
                <IonHeader>
                    <IonRow>
                        <IonCol className="bold borders">Model Name</IonCol>
                        <IonCol className="bold borders">Make Name</IonCol>
                        <IonCol className="bold borders">City</IonCol>
                        <IonCol className="bold borders">Engine</IonCol>
                        <IonCol className="bold borders" style={{"maxWidth":"110px"}}></IonCol>
                    </IonRow>
                </IonHeader>
                {items.map(car => (
                   car.model ? (<IonRow key={car.id} >
                        <IonCol className="borders">{car.model}</IonCol>
                        <IonCol className="borders">{car.make}</IonCol>
                          <IonCol className="borders">{car.city}</IonCol>
                        <IonCol className="borders">{car.engine_type}</IonCol>

                            <IonModal isOpen={showEditModal} cssClass='my-custom-class' id="editModal">
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

                            <IonItem lines="none" class="remove_inner_bottom borders">
                                <IonButton color="favorite" data-target="#editModal" onClick={() => {setShowEditModal(true); showDetails(car)}}>
                                    <IonImg src={Edit} style={{"width":"20px","cursor":"pointer"}} />
                                </IonButton> 
                                <IonButton color="favorite" onClick={() => deleteUsedCars(car)}>
                                    <IonImg src={Delete} style={{"width":"20px","cursor":"pointer"}}/>
                                </IonButton>
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

















