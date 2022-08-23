import { PlantTechnician } from './plant_technician';
import { WarehouseTechnician } from './warehouse_technicians';

export interface WorkOrder {
  status: string;
  personDetails: number;
  priorityNumber: number;
  priorityStatus: string;
  colour: string;
  workOrderID: number;
  workOrderDesc: string;
  workCenter: string;
  plant: string;
  equipmentName: string;
  kitStatus: string;
  dueDate: string;
  estimatedTime: string;
  actualTime: string;
  operationProgress: number[];
  timeProgress: number;
  operations: any;
  technician: PlantTechnician[];
}

export interface WorkOrders {
  unassigned: WorkOrder[];
  assigned: WorkOrder[];
  inProgress: WorkOrder[];
  completed: WorkOrder[];
}
