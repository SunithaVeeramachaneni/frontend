import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { HierarchyEntity } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AssetHierarchyUtil {
  constructor() {}

  getAssetCountByNode(node) {
    let count = 0;
    if (node.hasChildren && node.children && node.children.length) {
      node.children.forEach((child) => {
        if (child.type === 'Asset') {
          count++;
          count += this.getAssetCountByNode(child);
        } else if (
          child.hasChildren &&
          child.children &&
          child.children.length
        ) {
          count += this.getAssetCountByNode(child);
        }
      });
    }
    return count;
  }

  getTasksCountByNode(node) {
    return 0;
  }

  convertHierarchyToFlatList(hierarchy) {
    let flatHierarchy = [];
    hierarchy.forEach((node) => {
      flatHierarchy.push(node);
      if (node.hasChildren && node.children.length) {
        const childFlatHierarchy = this.convertHierarchyToFlatList(
          node.children
        );
        flatHierarchy = [...flatHierarchy, ...childFlatHierarchy];
      }
    });
    return flatHierarchy;
  }

  getHierarchyCount = (hierarchyList: HierarchyEntity[]) => {
    let count = 0;
    hierarchyList.forEach((hierarchyItem) => {
      if (!hierarchyItem.hasChildren) count++;
      else count += this.getHierarchyCount(hierarchyItem.children) + 1;
    });
    return count;
  };

  getCountByNodeType = (hierarchyList: HierarchyEntity[], type: string) => {
    let count = 0;
    hierarchyList.forEach((node) => {
      if (node.type === type && node.isSelected) count++;
      if (node.children.length)
        count += this.getCountByNodeType(node.children, type);
    });
    return count;
  };

  prepareHierarchyList = (
    flatList: any[],
    parentId = null
  ): HierarchyEntity[] => {
    const nodes: HierarchyEntity[] = [];
    const filteredFlatList = flatList.filter((item) => item.parentId);
    flatList.forEach((node) => {
      const { name, type, image } = node;
      const leafNode = {
        id: uuidv4(),
        dynamoDBId: node.id,
        name,
        type,
        image,
        sequence: null,
        hasChildren: false,
        subFormId: '',
        isSelected: false,
        isToggledView: false,
        children: [] as HierarchyEntity[]
      } as HierarchyEntity;

      if (!node.parentId || (parentId && node.parentId === parentId)) {
        if (!flatList.findIndex((item) => item.parentId === node.id))
          nodes.push(leafNode); // Node without children
        // Nodes with children
        else
          nodes.push({
            ...leafNode,
            hasChildren: true,
            children: this.prepareHierarchyList(filteredFlatList, node.id)
          } as HierarchyEntity);
      }
    });

    return nodes;
  };

  getHierarchyByNodeId = (
    hierarchyList: HierarchyEntity[],
    nodeId: string
  ): HierarchyEntity => {
    let leafNode = {} as HierarchyEntity;
    for (const node of hierarchyList) {
      if (node.dynamoDBId === nodeId) {
        leafNode = {
          ...node,
          hasChildren: false,
          children: [] as HierarchyEntity[]
        };
        break;
      } else if (node.dynamoDBId !== nodeId && node.children.length) {
        leafNode = {
          ...node,
          children: [
            this.getHierarchyByNodeId(node.children, nodeId)
          ] as HierarchyEntity[]
        };
        break;
      }
    }
    return leafNode;
  };

  cleanSelectedHierarchyList = (hierarchyList): HierarchyEntity[] => {
    let nodes = [] as HierarchyEntity[];
    hierarchyList.forEach((node) => {
      if (node.isSelected && !node.hasChildren) {
        nodes.push(node);
      } else {
        const childNodes = this.cleanSelectedHierarchyList(node.children);
        if (node.isSelected)
          nodes.push({
            ...node,
            children: childNodes
          });
        // If current node is selected, only selected child nodes get filtered into its children[].
        else nodes = [...nodes, ...childNodes]; // If current node is not selected but children are, children get promoted to previous node's level in the hierarchy.
      }
    });

    return nodes;
  };
}
