import { Injectable } from '@angular/core';

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

  getTotalAssetCount(rootNode) {
    let count = 0;
    rootNode.forEach((node) => {
      if (node.type === 'Asset') {
        count++;
      }
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
    });
    return count;
  }

  convertHierarchyToFlatList(hierarchy: any[], sequenceNum: number) {
    let flatHierarchy = [];
    hierarchy.forEach((node) => {
      node.sequence = sequenceNum++;
      const tempNode = JSON.parse(JSON.stringify(node));
      tempNode.children = [];
      flatHierarchy.push(tempNode);
      if (node.hasChildren && node.children.length) {
        const childFlatHierarchy = this.convertHierarchyToFlatList(
          node.children,
          sequenceNum++
        );
        flatHierarchy = [...flatHierarchy, ...childFlatHierarchy];
      }
    });
    return flatHierarchy;
  }
}
