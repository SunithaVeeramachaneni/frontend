export interface HierarchyEntity {
  id: string;
  type: 'location' | 'asset';
  name: string;
  image: string;
  hasChildren: boolean;
  subFormId: string;
  children: HierarchyEntity[];
}

export enum EntityType {
  location,
  asset
}
