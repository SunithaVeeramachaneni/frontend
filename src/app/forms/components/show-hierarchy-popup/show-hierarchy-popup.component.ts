import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

import { HierarchyEntity } from 'src/app/interfaces';
import { State } from '../../state';
import { getMasterHierarchyList } from '../../state';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-show-hierarchy-popup',
  templateUrl: './show-hierarchy-popup.component.html',
  styleUrls: ['./show-hierarchy-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowHierarchyPopupComponent implements OnInit {
  @Input() set nodeUid(id) {
    this.uid = id;
  }

  @Output() closeHierarchyOverlay: EventEmitter<boolean> = new EventEmitter();
  @Input() positions;

  public hierarchyList$: Observable<HierarchyEntity[]>;
  public hierarchyList: any[];
  public hierarchyToBeDisplayed = {} as HierarchyEntity;
  public uid: string;

  constructor(
    private store: Store<State>,
    private assetHierarchyUtil: AssetHierarchyUtil
  ) {}

  ngOnInit(): void {
    console.log('show hierarchy popup component');
    this.hierarchyList$ = this.store.select(getMasterHierarchyList).pipe(
      tap((masterHierarchyList) => {
        this.hierarchyList = masterHierarchyList;
        this.hierarchyToBeDisplayed =
          this.assetHierarchyUtil.getHierarchyByNodeUid(
            this.hierarchyList,
            this.uid
          );
      })
    );
  }

  closeShowHierarchy = () => this.closeHierarchyOverlay.emit(false);
}
