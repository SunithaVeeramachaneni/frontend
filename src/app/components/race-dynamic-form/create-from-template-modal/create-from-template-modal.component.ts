import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { RaceDynamicFormService } from '../services/rdf.service';
import { UsersService } from '../../user-management/services/users.service';
import { formConfigurationStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-create-from-template-modal',
  templateUrl: './create-from-template-modal.component.html',
  styleUrls: ['./create-from-template-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFromTemplateModalComponent implements OnInit {
  public searchTemplates: FormControl;
  private allTemplates: any[];
  displayedTemplates = [];
  templateLoadingFinished = false;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  filterJson: any[] = [];
  filter: any = {
    status: '',
    modifiedBy: '',
    createdBy: ''
  };
  status: any[] = ['Draft', 'Ready'];
  lastPublishedBy = [];
  createdBy = [];
  isPopoverOpen = false;

  constructor(
    private dialogRef: MatDialogRef<CreateFromTemplateModalComponent>,
    private cdrf: ChangeDetectorRef,
    private raceDynamicFormService: RaceDynamicFormService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.getUsersInfo$().subscribe((_) => {
      this.raceDynamicFormService.fetchAllTemplates$().subscribe((res) => {
        this.allTemplates = res.rows
          .filter((item) => item.formStatus === formConfigurationStatus.ready)
          .map((item) => {
            return {
              ...item,
              author: this.usersService.getUserFullName(item.author),
              lastPublishedBy: this.usersService.getUserFullName(
                item.lastPublishedBy
              )
            };
          });
        this.displayedTemplates = this.allTemplates;
        this.initializeFilter();
        this.templateLoadingFinished = true;
        this.cdrf.detectChanges();
      });
    });

    this.searchTemplates = new FormControl('');
    this.searchTemplates.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((searchTerm: string) => {
          this.applySearchAndFilter(searchTerm);
        })
      )
      .subscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  submitTemplate(index: number) {
    this.dialogRef.close({ selectedTemplate: this.displayedTemplates[index] });
  }

  initializeFilter() {
    this.raceDynamicFormService
      .getCreateFromTemplateFilter()
      .subscribe((res) => {
        this.filterJson = res;

        const uniqueLastPublishedBy = this.allTemplates
          .map((item: any) => item.lastPublishedBy)
          .filter((value, index, self) => self.indexOf(value) === index);
        for (const item of uniqueLastPublishedBy) {
          if (item) {
            this.lastPublishedBy.push(item);
          }
        }
        const uniqueCreatedBy = this.allTemplates
          .map((item: any) => item.author)
          .filter((value, index, self) => self.indexOf(value) === index);
        for (const item of uniqueCreatedBy) {
          if (item) {
            this.createdBy.push(item);
          }
        }
        for (const item of this.filterJson) {
          if (item.column === 'modifiedBy') {
            item.items = this.lastPublishedBy;
          } else if (item.column === 'createdBy') {
            item.items = this.createdBy;
          }
        }
      });
  }

  applySearchAndFilter(searchTerm: string) {
    this.displayedTemplates = this.allTemplates
      .filter((item: any) =>
        item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
      )
      .filter((item: any) => {
        if (
          this.filter['status'] !== '' &&
          this.filter['status'] !== item.formStatus
        ) {
          return false;
        } else if (
          this.filter['modifiedBy'] !== '' &&
          this.filter['modifiedBy'].indexOf(item.lastPublishedBy) === -1
        ) {
          return false;
        } else if (
          this.filter['createdBy'] !== '' &&
          this.filter['createdBy'].indexOf(item.author) === -1
        ) {
          return false;
        }
        return true;
      });
    this.cdrf.detectChanges();
  }

  updateFilter(data: any) {
    for (const item of data) {
      this.filter[item.column] = item.value;
    }
    this.applySearchAndFilter(this.searchTemplates.value);
  }

  resetFilter() {
    this.filter = {
      status: '',
      modifiedBy: '',
      createdBy: ''
    };
    this.applySearchAndFilter(this.searchTemplates.value);
  }
}
