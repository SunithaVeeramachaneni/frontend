import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { FormMetadata } from 'src/app/interfaces';
import { getFormMetadata, State } from 'src/app/forms/state';
import { getTotalTasksCount } from '../../state/builder/builder-state.selectors';

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
}
