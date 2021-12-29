import { Technician } from "./technicians";

export interface WorkOrder {
    status: string,
    personDetails: number,
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
    operationProgress: number[],
    timeProgress: number,
    operations: any,
    technician?: any
}

export interface WorkOrders {
    unassigned : WorkOrder[],
    assigned: WorkOrder[],
    inProgress: WorkOrder[],
    completed: WorkOrder[]
}