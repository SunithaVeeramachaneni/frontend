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
        if (child.type === 'asset') {
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

  getAssetsLocationsCountByNode(node) {
    let count = 0;
    if (node.hasChildren || (node.children && node.children.length)) {
      node.children.forEach((child) => {
        count++;
        if (child.hasChildren || (child.children && child.children.length)) {
          count += this.getAssetsLocationsCountByNode(child);
        }
      });
    }
    return count;
  }

  getTotalAssetCount(rootNode) {
    let count = 0;
    rootNode.forEach((node) => {
      if (node.type === 'asset') {
        count++;
      }
      if (node.hasChildren || (node.children && node.children.length)) {
        node.children.forEach((child) => {
          if (child.type === 'asset') {
            count++;
            count += this.getAssetCountByNode(child);
          } else if (
            child.hasChildren ||
            (child.children && child.children.length)
          ) {
            count += this.getAssetCountByNode(child);
          }
        });
      }
    });
    return count;
  }

  getTotalAssetsLocationsCount(rootNode) {
    let count = 0;
    rootNode.forEach((node) => {
      count++;
      if (node.hasChildren || (node.children && node.children.length)) {
        node.children.forEach((child) => {
          count++;
          if (child.hasChildren || (child.children && child.children.length)) {
            count += this.getAssetsLocationsCountByNode(child);
          }
        });
      }
    });
    return count;
  }

  getAllChildrenIDsByNode(node) {
    let childrenIds = [];
    childrenIds.push(node.id);
    if (node.hasChildren || (node.children && node.children.length)) {
      node.children.forEach((child) => {
        const recursiveChildIds = this.getAllChildrenIDsByNode(child);
        childrenIds = [...childrenIds, ...recursiveChildIds];
      });
    }
    return childrenIds;
  }

  getAllChildrenUIDsByNode(node) {
    let childrenIds = [];
    if (node.hasChildren || (node.children && node.children.length)) {
      node.children.forEach((child) => {
        childrenIds.push(child.uid);
        const recursiveChildIds = this.getAllChildrenIDsByNode(child);
        childrenIds = [...childrenIds, ...recursiveChildIds];
      });
    }
    return childrenIds;
  }

  convertHierarchyToFlatList(hierarchy: any[], sequenceNum: number) {
    let flatHierarchy = [];
    hierarchy.forEach((node) => {
      node.sequence = sequenceNum++;
      const tempNode = JSON.parse(JSON.stringify(node));
      tempNode.children = [];
      flatHierarchy.push(tempNode);
      if (node.hasChildren || node.children.length) {
        const childFlatHierarchy = this.convertHierarchyToFlatList(
          node.children,
          sequenceNum++
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
      const { name, type, image, description } = node;
      const leafNode = {
        uid: node.id,
        name,
        type,
        image,
        nodeId: type === 'location' ? node.locationId : node.assetsId,
        nodeDescription: description || '',
        sequence: null,
        hasChildren: false,
        parentId,
        isSelected: false,
        isToggledView: false,
        children: [] as HierarchyEntity[]
      } as HierarchyEntity;

      if (!node.parentId || (parentId && node.parentId === parentId)) {
        if (flatList.findIndex((item) => item.parentId === node.id) < 0)
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

  prepareAssetHierarchy = (selectedHierarchy: any[]): any => {
    const flatList = this.convertHierarchyToFlatList(selectedHierarchy, 0);
    const instanceIdMappings = {};
    flatList.forEach((node) => {
      if (instanceIdMappings[node.uid]) {
        const { children, ...rest } = node;
        instanceIdMappings[node.uid].push(rest);
      } else {
        instanceIdMappings[node.uid] = [];
        const { children, ...rest } = node;
        instanceIdMappings[node.uid].push(rest);
      }
    });

    const uniqueNodes = this.getUniqueRootNodes(flatList);
    const hierarchy = [];
    uniqueNodes.forEach((root) => {
      const convertedHierarchy = this.flatListToHierarchy(flatList, root);
      hierarchy.push(convertedHierarchy);
    });
    return { stitchedHierarchy: hierarchy, instanceIdMappings };
  };

  removeDuplicateNodes = (flatList) =>
    flatList
      .filter((v, i, a) => a.findIndex((v2) => v2.uid === v.uid) === i)
      .filter((v) => v.parentId !== null);

  getUniqueRootNodes = (flatList) =>
    flatList
      .filter((v, i, a) => a.findIndex((v2) => v2.uid === v.uid) === i)
      .filter((v) => v.parentId === null);

  flatListToHierarchy = (array, parent) => {
    parent = parent !== null ? parent : { uid: null };
    const children = array.filter((child) => child.parentId === parent.uid);
    if (children && children.length) {
      const nonDuplicateChildren = this.removeDuplicateNodes(children);
      parent.children = nonDuplicateChildren;
      children.forEach((child) => this.flatListToHierarchy(array, child));
    }
    return parent;
  };

  getHierarchyByNodeUid = (
    hierarchyList: HierarchyEntity[],
    nodeUid: string
  ) => {
    let leafNode = {} as HierarchyEntity;
    for (const node of hierarchyList) {
      if (node.uid === nodeUid) {
        leafNode = {
          ...node,
          hasChildren: false,
          children: [] as HierarchyEntity[]
        };
        break;
      } else if (node.hasChildren) {
        const childNode = this.getHierarchyByNodeUid(node.children, nodeUid);
        if (Object.keys(childNode).length) {
          leafNode = {
            ...node,
            hasChildren: true,
            children: [childNode]
          };
          break;
        }
      }
    }
    return leafNode;
  };

  cleanSelectedHierarchyList = (
    hierarchyList,
    ancestralPath = []
  ): HierarchyEntity[] => {
    let nodes = [] as HierarchyEntity[];
    hierarchyList.forEach((node) => {
      const { type, nodeId: id, name, nodeDescription: description } = node;
      const nodePath = [...ancestralPath, { type, id, name, description }];
      if (node.isSelected && !node.hasChildren) {
        nodes.push({
          ...node,
          isRootNode: !node.parentId ? true : false,
          configuredParentId: node.parentId,
          iSDeletedInRoutePlan: false,
          id: node.id ? node.id : uuidv4(),
          isOriginal: true,
          hierarchyPath: nodePath,
          isExpanded: true,
          numTimesCopied: 0
        });
      } else {
        const childNodes = this.cleanSelectedHierarchyList(
          node.children,
          nodePath
        );
        if (node.isSelected)
          nodes.push({
            ...node,
            id: node.id ? node.id : uuidv4(),
            isExpanded: true,
            isOriginal: true,
            isRootNode: !node.parentId ? true : false,
            configuredParentId: node.parentId,
            children: childNodes,
            hierarchyPath: nodePath,
            numTimesCopied: 0
          });
        // If current node is selected, only selected child nodes get filtered into its children[].
        else nodes = [...nodes, ...childNodes]; // If current node is not selected but children are, children get promoted to previous node's level in the hierarchy.
      }
    });

    return nodes;
  };

  toggleAllChildrenSelection = (
    checked: boolean,
    children: HierarchyEntity[]
  ): HierarchyEntity[] =>
    children.map((child) => ({
      ...child,
      isSelected: checked,
      children: child.hasChildren
        ? this.toggleAllChildrenSelection(checked, child.children)
        : ([] as HierarchyEntity[])
    }));

  togglePreviouslySelectedChildren = (
    children: HierarchyEntity[],
    selectedChildrenFlatList: HierarchyEntity[]
  ): HierarchyEntity[] =>
    children.map((child) => ({
      ...child,
      id: selectedChildrenFlatList.find((item) => item.uid === child.uid)?.id,
      isSelected:
        selectedChildrenFlatList.findIndex((item) => item.uid === child.uid) >
        -1,
      children: child.hasChildren
        ? this.togglePreviouslySelectedChildren(
            child.children,
            selectedChildrenFlatList
          )
        : ([] as HierarchyEntity[])
    }));

  toggleSearchSelectedNode = (
    nodeUid: string,
    hierarchyList: HierarchyEntity[]
  ): HierarchyEntity[] => {
    const nodes = [] as HierarchyEntity[];
    hierarchyList.forEach((node) => {
      const children = node.hasChildren
        ? this.toggleSearchSelectedNode(nodeUid, node.children)
        : ([] as HierarchyEntity[]);
      nodes.push({
        ...node,
        isToggledView:
          children.findIndex((item) => item.isParentToBeToggled) > -1,
        isParentToBeToggled:
          node.uid === nodeUid ||
          children.findIndex((item) => item.isParentToBeToggled) > -1,
        children
      });
    });

    return nodes;
  };

  getSelectedCount = (hierarchyList: HierarchyEntity[]): number => {
    let count = 0;
    hierarchyList.forEach((node) => {
      if (node.isSelected) count++;
      if (node.hasChildren) count += this.getSelectedCount(node.children);
    });
    return count;
  };

  cleanedHierarchyEntity = ({
    id,
    uid,
    nodeId,
    parentId,
    type,
    name,
    image,
    sequence,
    hierarchyPath,
    ...node
  }) => ({
    id,
    uid,
    nodeId,
    parentId,
    type,
    name,
    image,
    sequence,
    hierarchyPath
  });
}

// Wrote the below function outside class as its used in hierarchy.reducer where dependency injection cannot be used.

export const copyNodeToRoutePlan = (
  nodeToBeCopied: HierarchyEntity,
  hierarchyList: HierarchyEntity[]
): HierarchyEntity[] => {
  const nodes = [] as HierarchyEntity[];
  for (const node of hierarchyList) {
    if (nodeToBeCopied.id === node.id) {
      const numTimesCopied = node.numTimesCopied + 1;
      nodes.push(
        {
          ...node,
          numTimesCopied
        },
        {
          ...nodeToBeCopied,
          id: uuidv4(),
          name: `${nodeToBeCopied.name} (${numTimesCopied})`,
          numTimesCopied: 0,
          hasChildren: false,
          isOriginal: false,
          children: [] as HierarchyEntity[]
        }
      );
    } else
      nodes.push({
        ...node,
        children: node.hasChildren
          ? copyNodeToRoutePlan(nodeToBeCopied, node.children)
          : []
      });
  }
  return nodes;
};

export const deleteNodeFromHierarchy = (
  hierarchyList: HierarchyEntity[],
  instanceIds: string[],
  currentSelectedHierarchyState: HierarchyEntity[]
) => {
  let nodes = [] as HierarchyEntity[];
  for (const node of hierarchyList) {
    if (instanceIds.indexOf(node.id) < 0) {
      nodes.push({
        ...node,
        iSDeletedInRoutePlan: !findIfAnotherNodeInstanceExists(
          { id: node.id, uid: node.uid },
          currentSelectedHierarchyState
        ),
        children: node?.children?.length
          ? deleteNodeFromHierarchy(
              node.children,
              instanceIds,
              currentSelectedHierarchyState
            )
          : ([] as HierarchyEntity[])
      });
    } else if (node.hasChildren) {
      const childNodes = deleteNodeFromHierarchy(
        node.children,
        instanceIds,
        currentSelectedHierarchyState
      );
      nodes = [...nodes, ...childNodes];
    }
  }

  return nodes;
};

export const findIfAnotherNodeInstanceExists = (nodeIds, hierarchyList) => {
  const { id, uid } = nodeIds;
  let exists = false;

  for (const node of hierarchyList) {
    if (node.uid === uid && node.id !== id) {
      return true;
    } else if (node.children.length) {
      exists = findIfAnotherNodeInstanceExists(nodeIds, node.children);
    }
  }

  return exists;
};

export const findNodeByUid = (nodeUid, hierarchyList) => {
  let leafNode = {} as HierarchyEntity;
  for (const node of hierarchyList) {
    if (node.uid === nodeUid) {
      leafNode = node;
      break;
    } else if (node.hasChildren) {
      leafNode = findNodeByUid(nodeUid, node.children);
      if (Object.keys(leafNode).length) break;
    }
  }

  return leafNode;
};
