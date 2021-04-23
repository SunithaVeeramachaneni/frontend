import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Doughnut, Bar, Line } from 'react-chartjs-2';
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
    IonSegment,
    useIonViewWillEnter,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonSegmentButton,
    IonSearchbar,
    IonButton,
    IonItem, IonLabel, IonInput, IonImg, IonLoading
} from '@ionic/react';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';
import { UsedCarsInsightsSummary } from './UsedCarsInsights';

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
    const [showLoading1, setShowLoading1] = useState(false);
    const [showLoading2, setShowLoading2] = useState(false);
    const [showLoading3, setShowLoading3] = useState(false);
    const [showLoading4, setShowLoading4] = useState(false);
    const [items, setItems] =useState([] as any);
    const [count, setCount] = useState(1)
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [skip, setSkip] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [showLoading, setShowLoading] = useState(false);
    const [showContent, setShowContent] = useState("graphview");
    
    const [searchObject, setSearchObject] = useState({
        "make_name":"",
        "model_name":"",
        "city": "",
        "year": ""
      
    })



    function deletNullifiedProp(obj) {
        for (var prop in obj) {
            if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
                delete obj[prop];
            }
        }
    }

    
    const searchFields = async (searchObject, skip) => {
        setShowLoading(true);
        deletNullifiedProp(searchObject);
       let stringfiedSearch = JSON.stringify(searchObject);
        console.log(stringfiedSearch);

        const searchResults = await axios(`https://invamdemo-dbapi.innovapptive.com/search?page=1&limit=10&skip=${skip}&searchfeilds=${stringfiedSearch}`, {
            method: 'get',
            withCredentials: false
        });
        console.log(searchResults);
        if(searchResults && searchResults.data.usedcars.length > 0) {
            console.log(searchResults);
            setItems([]);
            setItems(searchResults.data.usedcars);
            setShowLoading(false);
            setDisableInfiniteScroll(searchResults.data.usedcars < 10);
        } else {
            setDisableInfiniteScroll(true);
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
        setCount(count => count + usedCars.length);
       
        if(searchObject.make_name!== "" || searchObject.model_name!== "" || searchObject.city !== "" || searchObject.year !== "") {
            await searchFields(searchObject, skip);
        } else {
            await fetchData(skip);
        }
      

        ($event.target as HTMLIonInfiniteScrollElement).complete();
      }


    const doughnutChartData = {
        labels: ['new cars', 'old cars'],
        datasets: [
            {
                label: newCarsByModelAndYearBarData.make_name,
                backgroundColor: ['#FF5E54', 'rgba(255,99,132,0.2)'],
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: newCarsByMakeDonutData.carsCount
            }
        ]
    };


    var barChart2Data = {
        labels: newCarsByModelAndYearBarData.years,
        datasets: [
            {
                label: newCarsByModelAndYearBarData.model_name,
                backgroundColor: 'rgba(139,33,238,0.9)',
                borderColor: 'rgba(108,25,185,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(139,33,238,0.4)',
                hoverBorderColor: 'rgba(108,25,185,1)',
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
    
    const { register, handleSubmit, errors } = useForm({}); // initialise the hook
    const [id, setId] = useState("")
    const [model_name, setModelName]= useState("Range Rover Velar");
    const [make_name, setMakeName]= useState("Land Rover")
    const [body_type, setBodyType]= useState("Sedan")
    const [city, setCity]= useState("San Juan")
    const [engine_type, setEngineType]= useState("I4")


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
                    console.log("carsbarchart", carStatusObject)
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
                console.log('fetchAllModelNameByMakeName', results)

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
                console.log('fetchCountByMakeNameAndYear', results)

                if (results.data && results.data.length > 0) {

                    const years = results.data.map(model => {
                        return model._id.year
                    })
                    let uniqueYears = Array.from(new Set(years));
                    const model_names = results.data.map(model => {
                        return model._id.model_name
                    })
                    let uniqueModels = Array.from(new Set(model_names));

                    let sortedYears = uniqueYears.sort();
                    let finalStackedData = [] as any;
                    let colotcount = 0;
                    uniqueModels.forEach((value) => {
                        let temp = {};
                        temp['label'] = value;
                        let countData = [] as any;
                        sortedYears.forEach((year) => {
                            let ct = 0;
                            results.data.map(model => {
                                if (model._id.year == year && model._id.model_name == value) {
                                    ct = model.count;
                                }
                            })
                            countData.push(ct)
                        })
                        temp['data'] = countData;
                        temp['backgroundColor'] = colorArray[colotcount++]
                        finalStackedData.push(temp)
                    })
                    console.log("finalStackedData", finalStackedData)
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

    }, [model, name, makeName1, makeName2])



   
    const setit = async (segval) => {
        setShowContent(segval);
    }



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
              <IonSegment onIonChange={e => setit(e.detail.value)} color="secondary">
          <IonSegmentButton value="graphview">
            <IonLabel>Graphic View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="allcars">
            <IonLabel>View All Used Cars</IonLabel>
          </IonSegmentButton>
       
        </IonSegment>

        <br />
        <br />

        {showContent && showContent === 'graphview' ? (
        <IonContent>
                <IonGrid style={{ "marginTop": "-16px" }}>
                    <IonRow>
                        <IonCol size="12" size-md="6">
                            <IonCard className="custom-card">
                                <IonLoading
                                    isOpen={showLoading1}
                                    onDidDismiss={() => setShowLoading1(false)}
                                    message={'Please wait...'}
                                    duration={10000}
                                />
                                <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>Model</IonLabel>
                                        <IonSelect 
                                            interface="popover" 
                                            value={model} placeholder="Renegade" onIonChange={e => setModel(e.detail.value)}>
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
                                    duration={10000}
                                />
                                <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect  interface="popover" value={name} placeholder="Kia" onIonChange={e => setName(e.detail.value)}>
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
                                    duration={10000}
                                />
                                <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect interface="popover" value={makeName1} placeholder="Kia" onIonChange={e => setMakeName1(e.detail.value)}>
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
                                    duration={10000}
                                />
                                <IonList style={{ "marginTop": "-16px", }}>
                                    <IonItem>
                                        <IonLabel>MakeName</IonLabel>
                                        <IonSelect interface="popover" value={makeName2} placeholder="Kia" onIonChange={e => setMakeName2(e.detail.value)}>
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


            </IonContent>): (
                         <IonContent style={{"height": "400px"}}>
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
                                    <IonButton onClick={() => searchFields(searchObject, 0)}   
                                           className={searchText ? "display" : "hide"} style={{"height":"40px"}}>Search</IonButton>
                                </IonItem>
                              
                             </IonItem>
                          
                      {/* <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                         onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                        <IonInfiniteScrollContent
                            loadingText="Loading more usedcars...">
                        </IonInfiniteScrollContent>
                      </IonInfiniteScroll> */}
            
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
                       <div style={{"clear": "both"}}> </div>
                       <br /><br /> 
                        <IonGrid style={{"marginTop":"5px"}}>
                            <IonHeader>
                                <IonRow>
                                    <IonCol className="bold borders">Model Name</IonCol>
                                    <IonCol className="bold borders">Make Name</IonCol>
                                    <IonCol className="bold borders">City</IonCol>
                                    <IonCol className="bold borders">Engine</IonCol>
                                    <IonCol className="bold borders" style={{"maxWidth":"94px"}}></IonCol>
                                </IonRow>
                            </IonHeader>
                            {items.map(car => (
                               car.model ? (<IonRow key={car.id} >
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
            
                                        <IonItem lines="none" class="remove_inner_bottom borders">
                                            <IonImg src={Edit} onClick={() => {setShowEditModal(true); showDetails(car)}} style={{"width":"20px","cursor":"pointer"}} />
                                            <IonImg src={Delete} style={{"width":"20px","cursor":"pointer","marginLeft":"20px"}} onClick={() => deleteUsedCars(car)}/>
                                        </IonItem>
            
                              </IonRow>): null
                            ))}
                                <IonInfiniteScroll threshold="200px" disabled={disableInfiniteScroll}
                                    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                                    <IonInfiniteScrollContent
                                        loadingText="Loading more UsedCars...">
                                    </IonInfiniteScrollContent>
                                </IonInfiniteScroll>
            
                            </IonGrid>
                          </IonContent>
            )


        }
        </React.Fragment>
    );
}

















