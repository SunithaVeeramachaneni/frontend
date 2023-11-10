import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetails } from 'src/app/interfaces';
import { UsersService } from '../../user-management/services/users.service';

@Component({
  selector: 'app-shr-observation',
  templateUrl: './shr-observation.component.html',
  styleUrls: ['./shr-observation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShrObservationComponent implements OnInit {
  @Input() shrDetailsData;
  arrowIcon = 'keyboard_arrow_down';
  showExpections = true;
  showIssues = true;
  showActions = true;
  exceptions = [];
  issues = [];
  actions = [];
  rounds = [];
  users$: Observable<UserDetails[]>;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.issues = JSON.parse(this.shrDetailsData.shrDetails.issues);
    this.actions = JSON.parse(this.shrDetailsData.shrDetails.actions);
    this.rounds = JSON.parse(this.shrDetailsData.shrDetails.rounds);
    if (typeof this.shrDetailsData.shrDetails.exceptions === 'string') {
      this.exceptions = JSON.parse(this.shrDetailsData.shrDetails.exceptions);
    }
    this.users$ = this.userService.getUsersInfo$();
  }

  toggleException(): void {
    this.showExpections = !this.showExpections;
  }

  toggleIssues(): void {
    this.showIssues = !this.showIssues;
  }

  toggleAction(): void {
    this.showActions = !this.showActions;
  }
}
