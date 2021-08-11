export interface WorkOrder {
    status: string,
    personDetails: string,
    priorityNumber: number,
    priorityStatus: string,
    colour: string,
    workOrderID: number,
    workOrderDesc: string,
    equipmentID: string,
    equipmentName: string,
    kitStatus: string,
    estimatedTime: string,
    actualTime: string,
    progress: number[],
}

export interface WorkOrders {
    unassigned: WorkOrder[],
    assigned: WorkOrder[],
    inProgress: WorkOrder[],
    completed: WorkOrder[]
}