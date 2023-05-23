import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getNodeWiseQuestionsCount,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
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
  @Output() nodeRemoved: EventEmitter<any> = new EventEmitter();

  @ViewChild('hierarchyMenuTrigger') hierarchyMenuTrigger: MatMenuTrigger;
  selectedNode: any;
  selectedNode$: any;
  nodeWiseQuestionsCount: any = {};
  nodeWiseQuestionsCount$: any;
  positions: any;
  public nodeSelectedForShowHierarchy = {} as any;
  public togglePopover = false;

  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.selectedNode$ = this.operatorRoundsService.selectedNode$.pipe(
      tap((data) => {
        this.selectedNode = data;
      })
    );

    this.nodeWiseQuestionsCount$ = this.store
      .select(getNodeWiseQuestionsCount())
      .pipe(
        tap((nodeWiseQuestionsCount) => {
          this.nodeWiseQuestionsCount = nodeWiseQuestionsCount;
        })
      );
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
  };
}
