/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { FormService } from 'src/app/forms/services/form.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit {
  @Input() node;
  @Input() hierarchyMode;
  @Input() dropTargetIds;
  @Input() isRevised = false;
  @Output() nodeRemoved: EventEmitter<any> = new EventEmitter();
  @Output() checkevent: EventEmitter<[any, any]> = new EventEmitter();
  @Input() set nodeWiseQuestionsCount(nodeWiseQuestionsCount: any) {
    if (nodeWiseQuestionsCount) {
      this._nodeWiseQuestionsCount = nodeWiseQuestionsCount;
    }
  }
  get nodeWiseQuestionsCount() {
    return this._nodeWiseQuestionsCount;
  }

  @ViewChild('hierarchyMenuTrigger') hierarchyMenuTrigger: MatMenuTrigger;
  selectedNode: any;
  selectedNode$: any;
  positions: any;
  allCheckedPages: any = { status: false };
  partiallyChecked: any = { status: false };
  checkboxStatus$: any;
  public nodeSelectedForShowHierarchy = {} as any;
  public togglePopover = false;
  private _nodeWiseQuestionsCount: any = {};

  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService,
    private cdfr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedNode$ = this.operatorRoundsService.selectedNode$.pipe(
      tap((data) => {
        this.selectedNode = data;
      })
    );

    this.checkboxStatus$ = this.operatorRoundsService.checkboxStatus$.pipe(
      tap((value) => {
        if (value !== null && value.nodeId === this.node.id) {
          this.allCheckedPages = {
            status: value.selectedPage.every((t) => t.complete)
          };

          this.partiallyChecked = {
            status:
              (value.selectedPage.filter((t) => t.partiallyChecked).length >
                0 ||
                value.selectedPage.filter((t) => t.complete).length > 0) &&
              !this.allCheckedPages.status
          };
        }
      })
    );

    this.operatorRoundsService.currentShownHierarchyNode$.subscribe((node) => {
      if (node.id !== this.node.id) {
        this.togglePopover = false;
        this.cdfr.markForCheck();
      }
    });
  }

  getTasksCountByNode(node) {
    let nodeId = node.id;
    if (this.hierarchyMode === 'asset_hierarchy') {
      nodeId = node.uid;
      const instanceIdMappings = this.formService.getInstanceIdMappings();
      const instances = instanceIdMappings[nodeId];
      const instanceIds = instances.map((i) => i.id);
      return instanceIds.reduce(
        (acc, curr) => (acc += this.nodeWiseQuestionsCount[curr] || 0),
        0
      );
    } else {
      return this.nodeWiseQuestionsCount[nodeId] || 0;
    }
  }

  getTotalTasksCountByNode(node) {
    if (this.hierarchyMode === 'asset_hierarchy') {
      let instanceIds = [];
      const instanceIdMappings = this.formService.getInstanceIdMappings();
      const allChildNodeUIds =
        this.assetHierarchyUtil.getAllChildrenUIDsByNode(node);
      allChildNodeUIds.forEach((childNode) => {
        const instances = instanceIdMappings[childNode];
        if (instances) {
          const instanceIdArr = instances.map((i) => i.id);
          instanceIds = [...instanceIds, ...instanceIdArr];
        }
      });
      return instanceIds.reduce(
        (acc, curr) => (acc += this.nodeWiseQuestionsCount[curr] || 0),
        0
      );
    } else {
      const allChildNodeIds =
        this.assetHierarchyUtil.getAllChildrenIDsByNode(node);
      return allChildNodeIds.reduce(
        (acc, curr) => (acc += this.nodeWiseQuestionsCount[curr] || 0),
        0
      );
    }
  }

  setSelectedNode(node) {
    if (this.selectedNode.id !== node.id) {
      this.operatorRoundsService.setSelectedNode(node);
    }
  }

  onRemoveNode(event, node) {
    this.hierarchyMenuTrigger.closeMenu();
    event.stopPropagation();
    this.nodeRemoved.emit(node);
  }

  removeNodeHandler(event) {
    this.nodeRemoved.emit(event);
  }

  toggleShowHierarchyPopover = (node) => {
    const position = document
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
    if (this.togglePopover) {
      this.operatorRoundsService.currentShownHierarchyNode$.next(node);
    }
  };

  toggleCheckBox(checked, node) {
    this.allCheckedPages.status = checked;
    this.partiallyChecked = false;
    this.checkevent.emit([checked, node]);
  }
}
