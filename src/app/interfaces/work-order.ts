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
}

export interface WorkOrders {
    unassigned: WorkOrder[],
    assigned: WorkOrder[],
    inProgress: WorkOrder[],
    complered: WorkOrder[]
}