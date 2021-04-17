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
    IonItem, IonLabel, IonInput, IonImg, IonLoading 
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
    const [newCarsByMakeDonutData, setNewCarsByMakeDonutData] = useState({} as any);
    const [newCountByModelNameLineData, setNewCountByModelNameLineData] = useState({} as any);
    const [countByMakeNameAndYear, setCountByMakeNameAndYear] = useState({} as any);
    
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

    var stackedGraphOptions = {
        legend: {
            display: false
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
            },
          ],
        },
      }
      var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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

    const [model, setModel] = useState("")
    const [name, setName] = useState("");
    const [makeName1, setMakeName1] = useState("");
    const [makeName2, setMakeName2] = useState("");
    const [showLoading1, setShowLoading1] = useState(false);
    const [showLoading2, setShowLoading2] = useState(false);
    const [showLoading3, setShowLoading3] = useState(false);
    const [showLoading4, setShowLoading4] = useState(false);



    

    useEffect(() => {
        //https://localhost:3000/getNewCarsByYear?make_name=Kia&cachedKey=sampesf
        const fetchNewCarsByModelAndYear = async (model) => {

            let modelName = (model === "") ? "Renegade" : model
            try {
                setShowLoading1(true);
                const results = await axios(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByModelNameAndYear?model_name=${modelName}`, {
                    method: 'get',
                    withCredentials: false
                });
                console.log(results);
                setNewCarsByModelAndYear(results.data);
                if (results.data && results.data.length > 0) {
                    
                    setShowLoading1(false);

                    const newCarsCount = results.data.map(model => {
                        return model.newCarsCount
                    })
                    const years = results.data.map(model => {
                        return model._id.year
                    })
                    let carStatusObject = {
                        years: years,
                        carsCount: newCarsCount,
                        model_name: modelName
                    }
                    console.log("carsbarchart",carStatusObject)
                    setNewCarsByModelAndYearBarData(carStatusObject)

                }


            } catch (error) {
                console.log(error);
            };
        }

        const fetchNewCarsByMakeName = async (name) => {
            let model = 'Range Rover Evoque';
            let makeName = (name === "") ? "Kia" : name
            
            try {
                setShowLoading2(true);
                const results = await axios(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByYear?make_name=${makeName}&cachedKey=sampesf`, {
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
                        make: makeName
                    }
                    console.log(carStatusObject)
                    setNewCarsByMakeDonutData(carStatusObject)
                    setShowLoading2(false);

                }


            } catch (error) {
                console.log(error);
            };
        }


        const fetchAllModelNameByMakeName = async (makeName1) => {
           let make_name = 'Kia';
           let makeName = (makeName1 === "") ? "Kia" : makeName1
            try {
                setShowLoading3(true);
                const results = await axios(`https://invamdemo-dbapi.innovapptive.com/getMakeNameAndModelName?make_name=${makeName}`, {
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
                        make_name: makeName,
                        carsCount: CarsCount,
                        model_names: model_names
                    }
                    setNewCountByModelNameLineData(carStatusObject);
                    setShowLoading3(false);

                }


            } catch (error) {
                console.log(error);
            };
        }

        const fetchCountByMakeNameAndYear = async (makeName2) => {
            let make_name = 'Kia';
            let makeName = (makeName2 === "") ? "Kia" : makeName2
            try {
                setShowLoading4(true);
                const results = await axios(`https://invamdemo-dbapi.innovapptive.com/getCountByMakeNameAndYear?make_name=${makeName}`, {
                    method: 'get',
                    withCredentials: false
                });
              console.log('fetchCountByMakeNameAndYear',results)
                
                if (results.data && results.data.length > 0) {

                    const years = results.data.map(model => {
                        return model._id.year
                    })
                    let uniqueYears =Array.from(new Set(years)) ;
                    const model_names = results.data.map(model => {
                        return model._id.model_name
                    })
                    let uniqueModels =Array.from(new Set(model_names)) ;

                    let sortedYears =  uniqueYears.sort();
                    let finalStackedData = [] as any;
                    let colotcount =0;
                    uniqueModels.forEach((value)=>{
                        let temp = {};
                        temp['label']=value;
                        let countData=[] as any;
                        sortedYears.forEach((year)=>{
                            let ct = 0;
                             results.data.map(model => {
                                if(model._id.year==year && model._id.model_name==value){
                                   ct= model.count;
                                }
                            })
                            countData.push(ct)
                        })
                        temp['data']=countData;
                        temp['backgroundColor'] =colorArray[colotcount++]
                        finalStackedData.push(temp)
                    })
                    console.log("finalStackedData",finalStackedData)
                    let carStatusObject = {
                        labels: sortedYears,
                        datasets: finalStackedData,
                    }
                    setCountByMakeNameAndYear(carStatusObject);
                    setShowLoading4(false);

                }


            } catch (error) {
                console.log(error);
            };
        }

        // fetchNewCarsByModel();
        fetchNewCarsByModelAndYear(model);
        fetchNewCarsByMakeName(name);
        fetchAllModelNameByMakeName(makeName1);
        fetchCountByMakeNameAndYear(makeName2);

    }, [model,name,makeName1,makeName2])


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
                <IonGrid style={{ "marginTop": "-16px" }}>
                    <IonRow>
                        <IonCol size="12" size-md="6">
                            <IonCard>
                            <IonLoading
                                    isOpen={showLoading1}
                                    onDidDismiss={() => setShowLoading1(false)}
                                    message={'Please wait...'}
                                />
                                <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>Model</IonLabel>
                                        <IonSelect value={model}  placeholder="Renegade"  onIonChange={e => setModel(e.detail.value)}>
                                            <IonSelectOption value="Discovery">Discovery</IonSelectOption>
                                            <IonSelectOption value="Traverse">Traverse</IonSelectOption>
                                            <IonSelectOption value="MAZDA3">MAZDA3</IonSelectOption>
                                            <IonSelectOption value="CX-5">CX-5</IonSelectOption>
                                            <IonSelectOption value="Equinox">Equinox</IonSelectOption>
                                        </IonSelect>
                                    </IonItem></IonList>
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
                            <IonLoading
                                    isOpen={showLoading2}
                                    onDidDismiss={() => setShowLoading2(false)}
                                    message={'Please wait...'}
                                />
                            <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect value={name} placeholder="Kia" onIonChange={e => setName(e.detail.value)}>
                                            <IonSelectOption value="Mazda">Mazda</IonSelectOption>
                                            <IonSelectOption value="Jeep">Jeep</IonSelectOption>
                                            <IonSelectOption value="Nissan">Nissan</IonSelectOption>
                                            <IonSelectOption value="Hyundai">Hyundai</IonSelectOption>
                                            <IonSelectOption value="Lexus">Lexus</IonSelectOption>
                                        </IonSelect>
                                    </IonItem></IonList>
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
                            <IonLoading
                                    isOpen={showLoading3}
                                    onDidDismiss={() => setShowLoading3(false)}
                                    message={'Please wait...'}
                                />
                            <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect value={makeName1} placeholder="Kia" onIonChange={e => setMakeName1(e.detail.value)}>
                                        <IonSelectOption value="Mazda">Mazda</IonSelectOption>
                                            <IonSelectOption value="Jeep">Jeep</IonSelectOption>
                                            <IonSelectOption value="Nissan">Nissan</IonSelectOption>
                                            <IonSelectOption value="Hyundai">Hyundai</IonSelectOption>
                                            <IonSelectOption value="Lexus">Lexus</IonSelectOption>
                                        </IonSelect>
                                    </IonItem></IonList>
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
                            <IonLoading
                                    isOpen={showLoading4}
                                    onDidDismiss={() => setShowLoading4(false)}
                                    message={'Please wait...'}
                                />
                            <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect value={makeName2} placeholder="Kia" onIonChange={e => setMakeName2(e.detail.value)}>
                                        <IonSelectOption value="Mazda">Mazda</IonSelectOption>
                                            <IonSelectOption value="Jeep">Jeep</IonSelectOption>
                                            <IonSelectOption value="Nissan">Nissan</IonSelectOption>
                                            <IonSelectOption value="Hyundai">Hyundai</IonSelectOption>
                                            <IonSelectOption value="Lexus">Lexus</IonSelectOption>
                                        </IonSelect>
                                    </IonItem></IonList>
                                <Bar data={countByMakeNameAndYear} options={stackedGraphOptions}
                                />
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>


            </IonContent>
        </React.Fragment>
    );
}

















