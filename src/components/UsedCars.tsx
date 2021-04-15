import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Doughnut, Bar,Line } from 'react-chartjs-2';
import {
    IonGrid,
    IonRow, IonCol, IonContent,
    IonToolbar,
    IonCard,
    IonList, IonSelect,
    IonSelectOption,
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
    const [model, setModel] = useState("");
    const [newCarsByMakeDonutData, setNewCarsByMakeDonutData] = useState({} as any);
    const [newCountByModelNameLineData, setNewCountByModelNameLineData] = useState({} as any);

    const doughnutChartData = {
        labels: ['new cars', 'old cars'],
        datasets: [
            {
                label: newCarsByModelAndYearBarData.make_name,
                backgroundColor: ['#36a2eb', 'rgba(255,99,132,0.2)'],
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data:newCarsByMakeDonutData.carsCount
            }
        ]
    };


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

    var lineChart2Data = {
        labels: newCountByModelNameLineData.model_names,
        datasets: [
            {
                label: newCountByModelNameLineData.make_name,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: newCountByModelNameLineData.carsCount
            }
        ]
    };


    const [usedCars, setUsedCars] = useState([] as any);

    //carsByModelDoughnutChart

    useEffect(() => {

        //http://localhost:3000/getNewCarsByYear?make_name=Kia&cachedKey=sampesf
        const fetchNewCarsByModelAndYear = async () => {
            let model = 'Range Rover Evoque';
            try {
                const results = await axios('http://localhost:3000/getNewCarsByModelNameAndYear?model_name=Range%20Rover%20Evoque', {
                    method: 'get',
                    withCredentials: false
                });
                console.log(results);
                setNewCarsByModelAndYear(results.data);
                if (results.data && results.data.length > 0) {

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
                    console.log("carsbarchart",carStatusObject)
                    setNewCarsByModelAndYearBarData(carStatusObject)

                }


            } catch (error) {
                console.log(error);
            };
        }

        const fetchNewCarsByMakeName = async () => {
            let model = 'Range Rover Evoque';
            try {
                const results = await axios('http://localhost:3000/getNewCarsByYear?make_name=Kia&cachedKey=sampesf', {
                    method: 'get',
                    withCredentials: false
                });
             
                
                if (results.data && results.data.length > 0) {

                    const carsCount = results.data.map(model => {
                        return model.carsCount
                    })
                    // const years = results.data.map(model => {
                    //     return model._id.year
                    // })
                    let carStatusObject = {
                        carsCount: carsCount,
                        make: make_name
                    }
                    console.log(carStatusObject)
                    setNewCarsByMakeDonutData(carStatusObject)

                }


            } catch (error) {
                console.log(error);
            };
        }


        const fetchAllModelNameByMakeName = async () => {
            let make_name = 'Kia';
            try {
                const results = await axios('http://localhost:3000/getMakeNameAndModelName?make_name=Kia', {
                    method: 'get',
                    withCredentials: false
                });
              console.log('fetchAllModelNameByMakeName',results)
                
                if (results.data && results.data.length > 0) {

                    const CarsCount = results.data.map(model => {
                        return model.modelCount
                    })
                    const model_names = results.data.map(model => {
                        return model._id.model_name
                    })
                    let carStatusObject = {
                        make_name: make_name,
                        carsCount: CarsCount,
                        model_names: model_names
                    }
                    setNewCountByModelNameLineData(carStatusObject)

                }


            } catch (error) {
                console.log(error);
            };
        }

        // fetchNewCarsByModel();
        fetchNewCarsByModelAndYear();
        fetchNewCarsByMakeName();
        fetchAllModelNameByMakeName();

    }, [])


    const { register, handleSubmit, errors } = useForm({}); // initialise the hook
    const [id, setId] = useState("")
    const [model_name, setModelName] = useState("Range Rover Velar");
    const [make_name, setMakeName] = useState("Land Rover")
    const [body_type, setBodyType] = useState("Sedan")
    const [city, setCity] = useState("San Juan")
    const [engine_type, setEngineType] = useState("I4")

    const showDetails = async data => {
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



    return (
        <React.Fragment>
            <IonContent>

                <IonGrid style={{ "marginTop": "10px" }}>
                    <IonRow>
                        <IonCol size="12" size-md="6">
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
                        <IonCol size="12" size-md="6">
                            <IonCard>


                                <Doughnut data={doughnutChartData} options={{
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
                                        text: 'Count of new cars by Make',
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
                    <IonRow>
                        <IonCol size="12" size-md="6">
                            <IonCard>
                                <Line data={lineChart2Data} options={{
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
                                        text: 'Count of Cars By Model Name',
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
                        <IonCol size="12" size-md="6">
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


            </IonContent>
        </React.Fragment>
    );
}

















