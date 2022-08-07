interface WorkCenterList {
  id: string;
  desc: string;
}
export interface WorkCenter {
  plantId: string;
  workCenters: WorkCenterList[];
}
