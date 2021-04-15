import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import {
    IonPage,
    IonTitle,
    IonGrid,
    IonRow, IonCol, IonContent,
    IonToolbar,
    IonMenuButton,
    IonCard,
    IonList,
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

import { UsedCarsInsightsSummary } from '../components/UsedCarsInsights';
import { IUrlOptions } from '../models/rest-api.model';

import Close from "../assets/images/close.svg";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";

import Swal from 'sweetalert2';

import "./Insight.css";


const Insight: React.FC = ({ cars, history }: any) => {
 // axios.interceptors.request.use(x => {
    //     x.meta = x.meta || {}
    //     x.meta.requestStartedAt = new Date().getTime();
    //     return x;
    // });

    const [responseTime, setResponseTime] = useState("");
    const [instructions, setInstructions] = useState([] as any);

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
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Insight</IonTitle>
                    <IonMenuButton slot="start" />
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <UsedCarsInsightsSummary cars={cars} />
            </IonContent>
        </IonPage>
    );
};

export default Insight;
