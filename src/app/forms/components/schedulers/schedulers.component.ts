import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectTab, UserDetails } from 'src/app/interfaces';

import { HeaderService } from 'src/app/shared/services/header.service';
import { UsersService } from 'src/app/components/user-management/services/users.service';
@Component({
  selector: 'app-schedulers',
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulersComponent implements OnInit, OnDestroy {
  tabIndex: number;
  Id: string;
  users$: Observable<UserDetails[]>;
  @Input() moduleName;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
    this.headerService.setHeaderTitle('Scheduler');
    this.users$ = this.userService.getUsersInfo$();
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
    this.Id = id;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    if (this.Id) {
      this.router.navigate(['/${moduleName}/scheduler', this.tabIndex], {
        queryParams: { Id: this.Id }
      });
    } else {
      this.router.navigate(['/${moduleName}/scheduler', this.tabIndex], {
        queryParams: { Id: null },
        queryParamsHandling: 'merge'
      });
    }
    this.Id = '';
  }
  ngOnDestroy(): void {}
}
