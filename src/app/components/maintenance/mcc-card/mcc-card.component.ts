import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  Input,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Permission, UserInfo } from 'src/app/interfaces';
import { tap } from 'rxjs/operators';
import { permissions as perms } from 'src/app/app.constants';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-mcc-card',
  templateUrl: './mcc-card.component.html',
  styleUrls: ['./mcc-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MCCCardComponent implements OnInit {
  @Input() workOrder;
  @Output() assign = new EventEmitter();
  isDropdownOpen = false;
  userInfo$: Observable<UserInfo>;
  permissions: Permission[];
  readonly perms = perms;

  constructor(
    public translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => (this.permissions = permissions))
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };
  onAssignPress = (workOrder) => {
    if (this.checkUserHasPermission('ASSIGN_WORK_ORDERS')) {
      this.assign.emit(workOrder);
    }
  };

  checkUserHasPermission(checkPermissions: string) {
    return this.loginService.checkUserHasPermission(
      this.permissions,
      checkPermissions
    );
  }
}
