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
    dueDate: Date,
    estimatedTime: string,
    actualTime: string,
    operationProgress: number[],
    timeProgress: number,
    operations: any
}

export interface WorkOrders {
    unassigned : WorkOrder[],
    assigned: WorkOrder[],
    inProgress: WorkOrder[],
    completed: WorkOrder[]
}