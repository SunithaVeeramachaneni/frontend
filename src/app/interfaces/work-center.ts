interface WorkCenterList {
  workCenterKey: string;
  workCenterDesc: string;
}
export interface WorkCenter {
  plantId: string;
  workCenters: WorkCenterList[];
}
