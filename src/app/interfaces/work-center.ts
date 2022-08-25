interface WorkCenterList {
  plantId: string;
  workCenterKey: string;
  workCenterDesc: string;
}
export interface WorkCenter {
  plantId: string;
  workCenters: WorkCenterList[];
}
