export interface WorkOrder {
    status: string,
    personDetails: string,
    priorityNumber: number,
    priorityStatus: string,
    colour: string,
    workOrderID: number,
    workOrderDesc: string,
    workCenter: string,
    equipmentName: string,
    kitStatus: string,
    dueDate: Date,
    estimatedTime: string,
    actualTime: string,
    progress: number[],
    partsavailable:string,
    partscolor:string,
    progressValue:number
}

export interface WorkOrders {
    kitsrequired : WorkOrder[],
    assingedforpicking: WorkOrder[],
    kittinginprogress: WorkOrder[],
    kitscomplete: WorkOrder[],
    kitspickedup: WorkOrder[]
}