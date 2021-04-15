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
    IonItem, IonLabel, IonInput, IonImg
} from '@ionic/react';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';

import Close from "../assets/images/close.svg";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";

import Swal from 'sweetalert2';

import "./UsedCars.css";

export const UsedCarsSummary = ({ cars }: any) => {

    // axios.interceptors.request.use(x => {
    //     x.meta = x.meta || {}
    //     x.meta.requestStartedAt = new Date().getTime();
    //     return x;
    // });

    const [responseTime, setResponseTime] = useState("");
    const [instructions, setInstructions] = useState([] as any);
    const [newCarsByModel, setNewCarsByModel] = useState([] as any);
    const [newCarsByModelAndYear, setNewCarsByModelAndYear] = useState([] as any);
    const [newCarsBarData, setNewCarsBarData] = useState({} as any);
    const [newCarsByModelAndYearBarData, setNewCarsByModelAndYearBarData] = useState({} as any);
    const [skip, setSkip] = useState(0)
    const [count, setCount] = useState(1)
    const [searchText, setSearchText] = useState("")

    // var barChartData = {
    //     labels: ['New Cars', 'Old Cars'],
    //     datasets: [
    //       {
    //         label: newCarsBarData.model_name,
    //         backgroundColor: 'rgba(255,99,132,0.2)',
    //         borderColor: 'rgba(255,99,132,1)',
    //         borderWidth: 1,
    //         hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    //         hoverBorderColor: 'rgba(255,99,132,1)',
    //         data: newCarsBarData.carStatus
    //       }
    //     ]
    //     };

        var barChart2Data = {
            labels: newCarsByModelAndYearBarData.years,
            datasets: [
              {
                label: newCarsByModelAndYearBarData.model_name,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: newCarsByModelAndYearBarData.carsCount
              }
            ]
            };


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
        let searchedResult = usedCars.filter(function(car){
            return car.make == searchText || car.model == searchText ;
        });
        console.log(searchedResult);
        if(searchedResult.length > 0) {
            setUsedCars(searchedResult);
        } else {
            // alert(searchedResult)
            //https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json
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

//carsByModelDoughnutChart

useEffect(() => {
   
    // const fetchNewCarsByModel = async () => {
    //     try {
    //         const results = await axios('http://localhost:3000/getNewCarsByModelAndFuelType?model_name=Discovery Sport', {
    //           method: 'get',
    //           withCredentials: false
    //        });
    //        console.log(results);
    //        setNewCarsByModel(results.data);
    //        if(results.data && results.data.length > 0) {
         
    //         const carStatus = results.data.map(status => {
    //             return status.countCars
    //         })
    //         const model_name = results.data.map(model => {
    //             return model._id.model_name
    //         })
    //         let carStatusObject = {
    //             carStatus: carStatus,
    //             model_name: model_name[0]
    //         } 
    //         console.log(carStatusObject)
    //         setNewCarsBarData(carStatusObject)
            
    //        }
          

    //     } catch(error) {
    //         console.log(error);
    //       };
    // }


    const fetchNewCarsByModelAndYear = async () => {
        let model='Range Rover Evoque';
        try {
            const results = await axios('http://localhost:3000/getNewCarsByModelNameAndYear?model_name=Range%20Rover%20Evoque', {
              method: 'get',
              withCredentials: false
           });
           console.log(results);
           setNewCarsByModelAndYear(results.data);
           if(results.data && results.data.length > 0) {
         
            const newCarsCount = results.data.map(model => {
                return model.newCarsCount
            })
            const years = results.data.map(model => {
                return model._id.year
            })
            let carStatusObject = {
                years: years,
                carsCount: newCarsCount,
                model_name: model_name
            } 
            console.log(carStatusObject)
            setNewCarsByModelAndYearBarData(carStatusObject)
            
           }
          

        } catch(error) {
            console.log(error);
          };
    }

    // fetchNewCarsByModel();
    fetchNewCarsByModelAndYear()

}, [])


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
           
            <IonGrid style={{"marginTop":"10px"}}>
            <IonRow>
                        {/* <IonCol className="bold borders"> */}
                        {/* <IonCard>
                        <Bar data={barChartData} options={{
                            scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                            },
                            title: {
                            display: true,
                            text: 'New Cars By Model',
                            fontSize: 15
                            },
                            legend: {
                            display: true,
                            position: 'bottom'
                            },
                            plugins: {
                            datalabels: { display: true }
                            }
                        }}
                     />
   
  </IonCard> */}
                        {/* </IonCol> */}
                        <IonCol className= "borders">
                        <IonCard>
                        <Bar data={barChart2Data} options={{
                            scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                            },
                            title: {
                            display: true,
                            text: 'Count of new cars by Model and Year',
                            fontSize: 15
                            },
                            legend: {
                            display: true,
                            position: 'bottom'
                            },
                            plugins: {
                            datalabels: { display: true }
                            }
                        }}
                     />
   
  </IonCard>
                        </IonCol>
                        </IonRow>
            </IonGrid>
            <IonGrid style={{"marginTop":"50px"}}>
                <IonHeader>
                    <IonRow>
                        <IonCol className="bold borders">Model Name</IonCol>
                        <IonCol className="bold borders">Make Name</IonCol>
                        <IonCol className="bold borders">City</IonCol>
                        <IonCol className="bold borders">Engine</IonCol>
                       
                    </IonRow>
                </IonHeader>
                {usedCars.map(car => (
                    <IonRow key={car.id} >
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
                    </IonRow>
                ))}
                </IonGrid>
              </IonContent>
        </React.Fragment>
    );
}

















