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
  
//carsByModelDoughnutChart

useEffect(() => {
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

 

    return (
        <React.Fragment>
             <IonContent>
           
            <IonGrid style={{"marginTop":"10px"}}>
            <IonRow>
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
              
            
              </IonContent>
        </React.Fragment>
    );
}

















