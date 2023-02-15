export interface HierarchyEntity {
  id: string;
  type: 'location' | 'asset';
  name: string;
  image: string;
  sequence: number | null;
  hasChildren: boolean;
  subFormId: string;
  children: HierarchyEntity[];
}

export enum EntityType {
  location,
  asset
}
