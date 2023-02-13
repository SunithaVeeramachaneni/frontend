import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { FormMetadata } from 'src/app/interfaces';
import { getFormMetadata, State } from 'src/app/forms/state';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  formMetadata$: Observable<FormMetadata>;

  filterIcon = 'assets/maintenance-icons/filterIcon.svg';

  hierarchyList = [];

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          this.hierarchyList = formMetadata.hierarchy;
          this.operatorRoundsService.setSelectedNode(formMetadata.hierarchy[0]);
        }
      })
    );
  }

  ngOnInit(): void {}

  removeNodeHandler(event) {
    this.promoteChildren([...this.hierarchyList], event);
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
}
