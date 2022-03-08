export interface WorkOrder {
  statusCode: string;
  status: string;
  personDetails: string;
  priorityNumber: number;
  priorityStatus: string;
  colour: string;
  workOrderID: number;
  workOrderDesc: string;
  equipmentID: string;
  equipmentName: string;
  kitStatus: string;
  dueDate: Date;
  estimatedTime: string;
  actualTime: string;
  progress: number[];
  partsavailable: string;
  progressValue: number;
  staged: number;
  totItems: number;
  assigneeId: string;
  assignee: string;
  isLoading: boolean;
}

export interface WorkOrders {
  '1': WorkOrder[];
  '2': WorkOrder[];
  '3': WorkOrder[];
  '4': WorkOrder[];
  '5': WorkOrder[];
}
