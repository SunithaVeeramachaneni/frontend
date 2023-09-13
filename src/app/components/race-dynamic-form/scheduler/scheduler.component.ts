import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectTab, UserDetails, UserGroup } from 'src/app/interfaces';

import { HeaderService } from 'src/app/shared/services/header.service';
import { UsersService } from '../../user-management/services/users.service';
import { routingUrls } from 'src/app/app.constants';
import { UserGroupService } from '../../user-management/services/user-group.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit, OnDestroy {
  tabIndex: number;
  formId: string;
  users$: Observable<UserDetails[]>;
  userGroups$: Observable<UserGroup[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private userService: UsersService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
    this.headerService.setHeaderTitle(routingUrls.schedularForms.title);
    this.users$ = this.userService.getUsersInfo$();
    this.userGroups$ = this.userGroupService.listAllUserGroups$();
  }

  getSelectedIndex(): number {
    return this.tabIndex;
  }

  selectTabHandler(event: SelectTab) {
    const {
      index,
      queryParams: { id }
    } = event;
    this.tabIndex = index;
    this.formId = id;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    if (this.formId) {
      this.router.navigate(['/forms/scheduler', this.tabIndex], {
        queryParams: { formId: this.formId }
      });
    } else {
      this.router.navigate(['/forms/scheduler', this.tabIndex], {
        queryParams: { formId: null },
        queryParamsHandling: 'merge'
      });
    }
    this.formId = '';
  }

  ngOnDestroy(): void {}
}
