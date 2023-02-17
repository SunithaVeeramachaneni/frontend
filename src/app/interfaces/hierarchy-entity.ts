export interface HierarchyEntity {
  id: string;
  dynamoDBId: string;
  type: 'location' | 'asset';
  name: string;
  image: string;
  sequence: number | null;
  hasChildren: boolean;
  subFormId: string;
  isSelected: boolean;
  isToggledView: boolean;
  children: HierarchyEntity[];
}

export enum EntityType {
  location,
  asset
}
