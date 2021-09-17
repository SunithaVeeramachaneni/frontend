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
    progress: number[],
    operations: any,
    technician?: Technician
}

export interface WorkOrders {
    unassigned : WorkOrder[],
    assigned: WorkOrder[],
    inProgress: WorkOrder[],
    completed: WorkOrder[]
}