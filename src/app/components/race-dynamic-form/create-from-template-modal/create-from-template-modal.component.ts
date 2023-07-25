import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil
} from 'rxjs/operators';

import { RaceDynamicFormService } from '../services/rdf.service';
import { UsersService } from '../../user-management/services/users.service';
import { formConfigurationStatus } from 'src/app/app.constants';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-from-template-modal',
  templateUrl: './create-from-template-modal.component.html',
  styleUrls: ['./create-from-template-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFromTemplateModalComponent implements OnInit, OnDestroy {
  public searchTemplates: FormControl;
  public displayedTemplates = [];
  public templateLoadingFinished = false;
  public isPopoverOpen = false;
  public filterJson: any[] = [];
  private lastPublishedBy = [];
  private createdBy = [];
  private allTemplates: any[];
  private filter: any = {
    status: '',
    modifiedBy: '',
    createdBy: ''
  };
  private onDestroy$ = new Subject();

  constructor(
    private dialogRef: MatDialogRef<CreateFromTemplateModalComponent>,
    private cdrf: ChangeDetectorRef,
    private raceDynamicFormService: RaceDynamicFormService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.getUsersInfo$().subscribe(() => {
      this.raceDynamicFormService
        .fetchTemplates$({ isArchived: false, isDeleted: false })
        .subscribe((res) => {
          this.allTemplates = res.rows
            .filter((item) => item.formStatus === formConfigurationStatus.ready)
            .map((item) => ({
              ...item,
              author: this.usersService.getUserFullName(item.author),
              lastPublishedBy: this.usersService.getUserFullName(
                item.lastPublishedBy
              )
            }));
          this.displayedTemplates = this.allTemplates;
          this.initializeFilter();
          this.templateLoadingFinished = true;
          this.cdrf.markForCheck();
        });
    });

    this.searchTemplates = new FormControl('');
    this.searchTemplates.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
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

        const uniqueLastPublishedBy = Array.from(
          new Set(
            this.allTemplates
              .map((item: any) => item.lastPublishedBy)
              .filter((item) => item != null)
          )
        );
        this.lastPublishedBy = uniqueLastPublishedBy;
        const uniqueCreatedBy = Array.from(
          new Set(
            this.allTemplates
              .map((item: any) => item.author)
              .filter((item) => item != null)
          )
        );
        this.createdBy = uniqueCreatedBy;

        this.filterJson.forEach((item) => {
          if (item.column === 'modifiedBy') {
            item.items = this.lastPublishedBy;
          } else if (item.column === 'createdBy') {
            item.items = this.createdBy;
          }
        });
      });
  }

  applySearchAndFilter(searchTerm: string) {
    this.displayedTemplates = this.allTemplates
      .filter((item: any) =>
        item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
      )
      .filter((item: any) => {
        if (
          this.filter.status !== '' &&
          this.filter.status !== item.formStatus
        ) {
          return false;
        } else if (
          this.filter.modifiedBy !== '' &&
          this.filter.modifiedBy.indexOf(item.lastPublishedBy) === -1
        ) {
          return false;
        } else if (
          this.filter.createdBy !== '' &&
          this.filter.createdBy.indexOf(item.author) === -1
        ) {
          return false;
        }
        return true;
      });
    this.cdrf.markForCheck();
  }

  updateFilter(data: any) {
    data.forEach((item) => {
      this.filter[item.column] = item.value;
    });
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
