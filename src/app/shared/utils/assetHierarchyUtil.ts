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
      if (node.isSelected && !node.hasChildren && node.type === type) count++;
      else count += this.getCountByNodeType(node.children, type);
    });
    return count;
  };

  prepareHierarchyList = (flatList: any[], parentId = null) => {
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
        children: []
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
}
