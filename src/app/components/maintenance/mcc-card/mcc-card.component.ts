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

@Component({
  selector: 'app-mcc-card',
  templateUrl: './mcc-card.component.html',
  styleUrls: ['./mcc-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MCCCardComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ){};

  @Input('workOrder') workOrder;
  @Output('assign') assign = new EventEmitter()
  isDropdownOpen = false;
  ngOnInit() {
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen
  }
  getImageSrc = (source: string) => {
    if (source) {
      let base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };
  onAssignPress =(workOrder) =>{
    this.assign.emit(workOrder)
  }



  ngOnDestroy() {
  }
}
  