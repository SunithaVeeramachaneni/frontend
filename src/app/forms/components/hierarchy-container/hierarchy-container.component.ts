import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { FormMetadata } from 'src/app/interfaces';
import { getFormMetadata, State } from 'src/app/forms/state';
import { HierarchyModalComponent } from 'src/app/forms/components/hierarchy-modal/hierarchy-modal.component';
import { getTotalTasksCount } from '../../state/builder/builder-state.selectors';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HierarchyDeleteConfirmationDialogComponent } from './hierarchy-delete-dialog/hierarchy-delete-dialog.component';
import { BuilderConfigurationActions } from '../../state/actions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  @Output() hierarchyEvent: EventEmitter<any> = new EventEmitter<any>();

  searchHierarchyKey: FormControl;
  formMetadata$: Observable<FormMetadata>;

  filterIcon = 'assets/maintenance-icons/filterIcon.svg';

  filteredHierarchyList = [];

  hierarchy = [];
  totalAssetsCount = 0;

  hierarchyMode = 'flat';
  flatHierarchyList = [];

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    public assetHierarchyUtil: AssetHierarchyUtil,
    private store: Store<State>,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          const { hierarchy } = formMetadata;
          this.totalAssetsCount =
            assetHierarchyUtil.getTotalAssetCount(hierarchy);
          this.hierarchy = JSON.parse(JSON.stringify(hierarchy));
          if (this.hierarchyMode === 'flat') {
            this.flatHierarchyList =
              assetHierarchyUtil.convertHierarchyToFlatList(hierarchy, 0);
            this.filteredHierarchyList = JSON.parse(
              JSON.stringify(this.flatHierarchyList)
            );
          }
          this.cdrf.detectChanges();
          this.operatorRoundsService.setSelectedNode(formMetadata.hierarchy[0]);
        }
      })
    );
  }

  ngOnInit(): void {
    this.searchHierarchyKey = new FormControl('');
    this.searchHierarchyKey.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchKey) => {
          if (searchKey.length > 3) {
            this.filteredHierarchyList = this.flatHierarchyList.filter((node) =>
              node.name.toLowerCase().includes(searchKey.toLowerCase())
            );
          } else if (searchKey.length < 3) {
            this.filteredHierarchyList = JSON.parse(
              JSON.stringify(this.flatHierarchyList)
            );
          }
          this.cdrf.detectChanges();
        })
      )
      .subscribe();
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(
      this.filteredHierarchyList,
      event.previousIndex,
      event.currentIndex
    );
    this.filteredHierarchyList.map((node, index) => {
      if (index >= event.currentIndex) {
        node.sequence = index;
      }
      return node;
    });
    this.hierarchyEvent.emit({
      hierarchy: this.filteredHierarchyList,
      node: event.item?.data
    });
  }

  getTotalTasksCount() {
    let count = 0;
    this.store.select(getTotalTasksCount()).subscribe((c) => {
      count = c;
    });
    return count;
  }

  removeNodeHandler(event) {
    const deleteConfirmationDialogRef = this.dialog.open(
      HierarchyDeleteConfirmationDialogComponent,
      {
        width: '450px',
        height: '165px',
        disableClose: true,
        data: { node: event }
      }
    );
    deleteConfirmationDialogRef.afterClosed().subscribe((resp) => {
      if (!resp) return;
      const hierarchyUpdated = this.promoteChildren([...this.hierarchy], event);
      this.store.dispatch(
        BuilderConfigurationActions.removeSubForm({
          subFormId: event.id
        })
      );
      this.hierarchyEvent.emit({
        hierarchy: hierarchyUpdated,
        node: event
      });
    });
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
