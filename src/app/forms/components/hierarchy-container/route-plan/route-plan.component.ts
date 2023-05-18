/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/dot-notation */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Inject,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getTasksCountByNodeId,
  getTasksCountByNodeIds,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { HierarchyEntity } from 'src/app/interfaces';
import {
  BuilderConfigurationActions,
  HierarchyActions
} from 'src/app/forms/state/actions';
import { formConfigurationStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-route-plan',
  templateUrl: './route-plan.component.html',
  styleUrls: ['./route-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutePlanComponent implements OnInit {
  @ViewChild('hierarchyMenuTrigger') hierarchyMenuTrigger: MatMenuTrigger;

  @Output() nodeRemoved: EventEmitter<any> = new EventEmitter();
  @Output() copyNode: EventEmitter<HierarchyEntity> = new EventEmitter();

  @Input() set hierarchy(hierarchy: any) {
    this._hierarchy = hierarchy ? hierarchy : ({} as any);
    this.prepareDragDrop(hierarchy);
  }
  get hierarchy(): any {
    return this._hierarchy;
  }
  @Input() hierarchyMode;

  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: any = null;
  positions: any;
  selectedNode: any;
  public nodeSelectedForShowHierarchy = {} as any;
  public togglePopover = false;

  private _hierarchy: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public assetHierarchyUtil: AssetHierarchyUtil,
    public dialog: MatDialog,
    private operatorRoundsService: OperatorRoundsService,
    private cdrf: ChangeDetectorRef,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.selectedNode$.subscribe((data) => {
      this.selectedNode = data;
      this.cdrf.detectChanges();
    });
  }

  setSelectedNode(node) {
    if (this.selectedNode.id !== node.id) {
      this.operatorRoundsService.setSelectedNode(node);
    }
  }

  getTasksCountByNodeId(nodeId) {
    let count = 0;
    this.store.select(getTasksCountByNodeId(nodeId)).subscribe((c) => {
      count = c;
    });
    return count;
  }
  getTotalTasksCountByNode(node) {
    let count = 0;
    const allChildNodeIds =
      this.assetHierarchyUtil.getAllChildrenIDsByNode(node);
    const index = allChildNodeIds.indexOf(node.id);
    if (index > -1) {
      allChildNodeIds.splice(index, 1);
    }
    this.store
      .select(getTasksCountByNodeIds(allChildNodeIds))
      .subscribe((c) => {
        count = c;
      });
    return count;
  }

  onRemoveNode(event, node) {
    this.hierarchyMenuTrigger.closeMenu();
    event.stopPropagation();
    this.nodeRemoved.emit(node);
  }

  dragMoved(event) {
    const e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item')
      ? e
      : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id')
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event) {
    if (!this.dropActionTodo) return;

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.hierarchy,
      'main'
    );

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId !== 'main'
        ? this.nodeLookup[parentItemId].children
        : this.hierarchy;
    const newContainer =
      targetListId !== 'main'
        ? this.nodeLookup[targetListId].children
        : this.hierarchy;

    const i = oldItemContainer.findIndex((c) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);
    if (
      draggedItem.hasChildren &&
      draggedItem.children &&
      draggedItem.children.length
    ) {
      const parentItem = this.nodeLookup[parentItemId];
      draggedItem.children.forEach((c) => {
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.push(c);
      });
      draggedItem.children = [];
      const parentIdx = oldItemContainer.findIndex(
        (c) => c.id === parentItemId
      );
      oldItemContainer[parentIdx] = parentItem;
    }

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(
          (c) => c.id === this.dropActionTodo.targetId
        );
        if (this.dropActionTodo.action === 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(
          draggedItem
        );
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }

    this.store.dispatch(
      HierarchyActions.updateSelectedHierarchyList({
        selectedHierarchy: this.hierarchy
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateFormStatuses({
        formStatus: formConfigurationStatus.draft,
        formDetailPublishStatus: formConfigurationStatus.draft,
        formSaveStatus: formConfigurationStatus.saving
      })
    );
    this.clearDragInfo(true);
    this.setSelectedNode(draggedItem);
  }

  getParentNodeId(id: string, nodesToSearch: any[], parentId: string): string {
    // eslint-disable-next-line prefer-const
    for (let node of nodesToSearch) {
      if (node.id === id) return parentId;
      const ret = this.getParentNodeId(id, node.children, node.id);
      if (ret) return ret;
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }
  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }
  prepareDragDrop(nodes: any[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }

  toggleShowHierarchyPopover = (node) => {
    const position = this.document
      .getElementById(`node-${node.id}`)
      .getBoundingClientRect();
    this.positions = {
      left: `${position.right + 10}px`,
      top: `${position.top - 220}px`,
      arrowleft: `${position.right}px`,
      arrowtop: `${position.top + 10}px`
    };

    this.nodeSelectedForShowHierarchy = node;
    this.togglePopover = !this.togglePopover;
  };

  triggerCopyNode = (node: HierarchyEntity) => this.copyNode.emit(node);
}
