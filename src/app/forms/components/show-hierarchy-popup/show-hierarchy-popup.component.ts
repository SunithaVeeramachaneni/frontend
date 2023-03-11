import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

import { HierarchyEntity } from 'src/app/interfaces';
import { State } from '../../state';
import { getMasterHierarchyList } from '../../state';
import { tap } from 'rxjs/operators';

interface ShowHierarchyPopupData {
  uid: string;
  position: any;
}

@Component({
  selector: 'app-show-hierarchy-popup',
  templateUrl: './show-hierarchy-popup.component.html',
  styleUrls: ['./show-hierarchy-popup.component.scss']
})
export class ShowHierarchyPopupComponent implements OnInit {
  public hierarchyList$: Observable<HierarchyEntity[]>;
  public hierarchyList: any[];
  public hierarchyToBeDisplayed = {} as HierarchyEntity;

  constructor(
    private store: Store<State>,
    private assetHierarchyUtil: AssetHierarchyUtil,
    private dialogRef: MatDialogRef<ShowHierarchyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShowHierarchyPopupData
  ) {}

  ngOnInit(): void {
    const { uid, position } = this.data;

    // this.dialogRef.updatePosition(position);

    this.hierarchyList$ = this.store.select(getMasterHierarchyList).pipe(
      tap((masterHierarchyList) => {
        this.hierarchyList = masterHierarchyList;
        this.hierarchyToBeDisplayed =
          this.assetHierarchyUtil.getHierarchyByNodeId(this.hierarchyList, uid);
      })
    );
  }

  closeShowHierarchy = () => this.dialogRef.close();
}
