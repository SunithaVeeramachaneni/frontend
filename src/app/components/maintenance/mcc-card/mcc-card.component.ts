import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  OnInit,
  Input,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/interfaces';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mcc-card',
  templateUrl: './mcc-card.component.html',
  styleUrls: ['./mcc-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MCCCardComponent implements OnInit {
  @Input('workOrder') workOrder;
  @Output('assign') assign = new EventEmitter();
  isDropdownOpen = false;
  permissions$: Observable<Permission[]>;
  permissions: Permission[];

  constructor(
    public translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.permissions$ = this.commonService.permissionsAction$.pipe(
      tap((permissions) => (this.permissions = permissions))
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getImageSrc = (source: string) => {
    if (source) {
      let base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };
  onAssignPress = (workOrder) => {
    if (this.checkUserHasPermission('ASSIGN_WORK_ORDERS')) {
      this.assign.emit(workOrder);
    }
  };

  checkUserHasPermission(checkPermissions: string) {
    return this.commonService.checkUserHasPermission(
      this.permissions,
      checkPermissions
    );
  }
}
