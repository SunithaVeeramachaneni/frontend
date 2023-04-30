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
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  getTasksCountByNodeId,
  getTasksCountByNodeIds,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { FormService } from 'src/app/forms/services/form.service';
import { MatMenuTrigger } from '@angular/material/menu';

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
  public nodeSelectedForShowHierarchy = {} as any;
  public togglePopover = false;

  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService,
    private cdrf: ChangeDetectorRef,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.selectedNode$.subscribe((data) => {
      this.selectedNode = data;
      this.cdrf.detectChanges();
    });
  }

  getTasksCountByNode(node) {
    let nodeId = node.id;
    let count = 0;
    if (this.hierarchyMode === 'asset_hierarchy') {
      nodeId = node.uid;
      const instanceIdMappings = this.formService.getInstanceIdMappings();
      const instances = instanceIdMappings[nodeId];
      const instanceIds = instances.map((i) => i.id);
      this.store.select(getTasksCountByNodeIds(instanceIds)).subscribe((c) => {
        count = c;
      });
      // commented due to performance regression while editing round plan.
      // setTimeout(() => this.cdrf.detectChanges(), 0);
      return count;
    } else {
      this.store.select(getTasksCountByNodeId(nodeId)).subscribe((c) => {
        count = c;
      });
      // commented due to performance regression while editing round plan.
      // setTimeout(() => this.cdrf.detectChanges(), 0);
      return count;
    }
  }

  getTotalTasksCountByNode(node) {
    let count = 0;
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
      this.store.select(getTasksCountByNodeIds(instanceIds)).subscribe((c) => {
        count = c;
      });
      return count;
    } else {
      const allChildNodeIds =
        this.assetHierarchyUtil.getAllChildrenIDsByNode(node);
      this.store
        .select(getTasksCountByNodeIds(allChildNodeIds))
        .subscribe((c) => {
          count = c;
        });
      return count;
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
    const nodeCoordinates = document
      .getElementById(`node-${node.id}`)
      .getBoundingClientRect();
    this.nodeSelectedForShowHierarchy = node;
    this.togglePopover = !this.togglePopover;
  };
}
