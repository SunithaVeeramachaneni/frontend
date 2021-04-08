import React, {useEffect, useState} from "react";
import {
    IonGrid,
    IonRow, IonCol, IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonHeader,
} from '@ionic/react';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";


import Swal from 'sweetalert2';

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
            const carsPromise = axios('http://localhost:3002/cars?skip=${skip}', {
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


    const [open, setOpen] = useState(false);
    const [openUpdateUsedCarsModal, setopenUpdateUsedCarsModal] = useState(false);

    const [openInstructionsModel, setOpenInstructionsModel] = useState(false);

   
    // const onSubmitUsedCars = async (data) => {
    //     console.log(data);
    //     axios.post('http://localhost:3000/car', {
    //         "vin": data.vin,
    //         "city": data.city,
    //         "dealer_zip": data.dealer_zip
    //       })
    //       .then((response) => {
    //         console.log(response);
    //         setOpen(false);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Added Successfully'
    //         })
    //       }, (error) => {
    //         console.log(error);
    //       });
    // }

    // const onSubmitUpdateUsedCars = async data => {
    //     console.log(data);
    //     axios.put(`http://localhost:300/updateCar/${data.id}`, {
    //         "id":data.id,
    //         "vin": data.vin,
    //         "city": data.city,
    //         "dealer_zip": data.dealer_zip
    //       })
    //       .then((response) => {
    //         console.log(response);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Added Successfully'
    //         })
    //       }, (error) => {
    //         console.log(error);
    //       });
    // }
    
    // const onSubmit = async data => {
    //     axios.post('http://localhost:3000/addInstruction', {
    //         "Category": "604de23cecf5cf44f863c934", 
    //         "WI_Name": data.WI_Name,
    //         "WI_Desc": data.WI_Desc,
    //         "Tools": data.Tools,         
    //         "IsFavorite": false,
    //         "AssignedObjects": data.AssignedObjects,
    //         "SpareParts": data.SpareParts,
    //         "SafetyKit": data.SafetyKit,
    //         "Published": false,
    //         "isPublishedBeforeSave": false,         
    //         "coverImage": data.coverImage
    //       })
    //       .then((response) => {
    //         console.log(response);
    //         setOpenInstructionsModel(false);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Added Successfully'
    //           })
            
    //       }, (error) => {
    //         console.log(error);
    //       });
    // };

    //   const deleteInstruction = (ins) => {
    //     axios.delete(`http://localhost:3000/deleteInstruction/${ins.insId}`).then(res => {
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Deleted Successfully'
    //     })
    //     const instruction = instructions.filter(item => item.insId !== ins.insId);
    //     setInstructions(instruction);
    //   })
    // }

    //   const deleteUsedCars = (cars) => {
    //       axios.delete(`http://localhost:3000/deleteCar/${cars.id}`).then(res => {
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Deleted Successfully'
    //         })
    //         const usedcar = usedCars.filter(item => item.id !== cars.id);
    //         setUsedCars(usedcar);
    //       })
    //   }

    const leaves = [
        { id: 1, title: 'GL', type: 'gl', balance: 8, fullName: 'General Leave' },
        { id: 2, title: 'PL', type: 'pl', balance: 15, fullName: 'Personal Leave' },
        { id: 3, title: 'Floater', type: 'floater', balance: 2, fullName: 'Floater' },
        { id: 4, title: 'Comp Off', type: 'compOff', balance: 5, fullName: 'Complementary Off' },
        { id: 5, title: 'Paternity/Maternity Leave', type: 'PML', balance: 0, fullName: 'Paternity/Maternity Leave' },
        { id: 6, title: 'LWP', type: 'LWP', balance: 0, fullName: 'Leave Without Pay' },
    ];

    return (
        <React.Fragment>
             <IonContent>
                <IonGrid>
                <IonHeader>
                    <IonRow>
                        <IonCol>
                       Model
                        </IonCol>
                        <IonCol>
                        Make
                        </IonCol>
                        <IonCol>
                       Body Type
                        </IonCol>
                        <IonCol>
                        City
                        </IonCol>
                        <IonCol>
                        Engine
                        </IonCol>
                        </IonRow>
                </IonHeader>
                {usedCars.map(car => (
                    <IonRow key={car.id} >
                        <IonCol>
                        {car.model}
                        </IonCol>
                        <IonCol>
                        {car.make}
                        </IonCol>
                        <IonCol>
                        {car.body_type}
                        </IonCol>
                        <IonCol>
                        {car.city}
                        </IonCol>
                        <IonCol>
                        {car.engine_type}
                        </IonCol>
                  </IonRow>
                ))}
                </IonGrid>
              </IonContent>
        </React.Fragment>
    );
}
