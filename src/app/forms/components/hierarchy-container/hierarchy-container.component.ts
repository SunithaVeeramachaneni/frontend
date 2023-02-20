import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { FormMetadata } from 'src/app/interfaces';
import { getFormMetadata, State } from 'src/app/forms/state';
import { HierarchyModalComponent } from 'src/app/forms/components/hierarchy-modal/hierarchy-modal.component';
import { getTotalTasksCount } from '../../state/builder/builder-state.selectors';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  @Output() hierarchyEvent: EventEmitter<any> = new EventEmitter<any>();

  formMetadata$: Observable<FormMetadata>;

  filterIcon = 'assets/maintenance-icons/filterIcon.svg';

  hierarchyList = [];
  hierarchyMode = 'flat';

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    public assetHierarchyUtil: AssetHierarchyUtil,
    private store: Store<State>,
    private dialog: MatDialog
  ) {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          const { hierarchy } = formMetadata;
          if (this.hierarchyMode === 'flat') {
            this.hierarchyList =
              assetHierarchyUtil.convertHierarchyToFlatList(hierarchy);
          }
          this.operatorRoundsService.setSelectedNode(formMetadata.hierarchy[0]);
        }
      })
    );
  }

  ngOnInit(): void {}

  getTotalTasksCount() {
    let count = 0;
    this.store.select(getTotalTasksCount()).subscribe((c) => {
      count = c;
    });
    return count;
  }

  removeNodeHandler(event) {
    const hierarchyListClone = JSON.parse(JSON.stringify(this.hierarchyList));
    const hierarchyUpdated = this.promoteChildren(
      [...hierarchyListClone],
      event
    );
    this.hierarchyEvent.emit({ hierarchy: hierarchyUpdated });
  }

  promoteChildren(list, node) {
    list = list.map((l) => {
      if (l.children && l.children.length) {
        const index = l.children.findIndex((i) => i.id === node.id);
        if (index > -1) {
          l.children = [
            ...l.children.slice(0, index),
            ...node.children,
            ...l.children.slice(index + 1)
          ];
        } else {
          this.promoteChildren(l.children, node);
        }
      }
      return l;
    });
    return list;
  }

  openHierarchyModal = () => {
    const dialogRef = this.dialog.open(HierarchyModalComponent, {});

    dialogRef.afterClosed().subscribe(console.log);
  };
}
