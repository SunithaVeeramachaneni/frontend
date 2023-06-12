export interface HierarchyEntity {
  id?: string;
  uid: string;
  type: 'location' | 'asset';
  name: string;
  image: string;
  nodeId?: string | null;
  nodeDescription?: string | null;
  sequence: number | null;
  hasChildren: boolean;
  subFormId?: string;
  isSelected: boolean;
  isToggledView: boolean;
  children: HierarchyEntity[];
  hierarchyPath?: string[];
  isExpanded?: boolean;
  parentId?: string;
  isOriginal?: boolean;
  isRootNode?: boolean;
  iSDeletedInRoutePlan?: boolean;
  configuredParentId?: string;
  numTimesCopied?: number;
  isParentToBeToggled?: boolean;
}

export enum EntityType {
  location,
  asset
}
