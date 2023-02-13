import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit {
  @Input() node;
  @Output() nodeRemoved: EventEmitter<any> = new EventEmitter();

  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  selectedNode: any;

  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private operatorRoundsService: OperatorRoundsService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.selectedNode$.subscribe((data) => {
      this.selectedNode = data;
      this.cdrf.detectChanges();
    });
  }

  setSelectedNode(node) {
    this.operatorRoundsService.setSelectedNode(node);
  }

  onRemoveNode(node) {
    this.nodeRemoved.emit(node);
  }

  removeNodeHandler(event) {
    this.nodeRemoved.emit(event);
    // let parentList = event.children;
    // const index = parentList.findIndex((h) => h.id === event.id);
    // if (index > -1) {
    //   if (event.children && event.children.length) {
    //     parentList = [
    //       ...parentList.slice(0, index),
    //       ...event.children,
    //       ...parentList.slice(index + 1)
    //     ];
    //   } else {
    //     parentList.splice(index, 1);
    //   }
    //   this.node.children = [...parentList];
    // } else {
    //   this.nodeRemoved.emit(event);
    // }
  }
}
