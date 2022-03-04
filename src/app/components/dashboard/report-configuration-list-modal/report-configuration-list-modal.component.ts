import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportCategory } from 'src/app/interfaces';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report-configuration-list-modal',
  templateUrl: './report-configuration-list-modal.component.html',
  styleUrls: ['./report-configuration-list-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportConfigurationListModalComponent implements OnInit {
  reportCategories$: Observable<ReportCategory[]>;
  searchObject: FormControl;
  searchObject$: Observable<string>;
  searchReport: FormControl;
  searchReport$: Observable<string>;
  selectedIndex = 0;
  filteredReportCategories$: Observable<ReportCategory[]>;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.searchObject = new FormControl('');
    this.searchObject$ = this.searchObject.valueChanges.pipe(startWith(''));
    this.searchReport = new FormControl('');
    this.searchReport$ = this.searchReport.valueChanges.pipe(startWith(''));
    this.reportCategories$ = this.reportService.getReportCategories$();

    this.filteredReportCategories$ = combineLatest([
      this.reportCategories$,
      this.searchObject$,
      this.searchReport$
    ]).pipe(
      map(([reportCategories, searchObject, searchReport]) => {
        const searchObjects = reportCategories.filter(
          (reportCategory) =>
            reportCategory.category
              .toLowerCase()
              .indexOf(searchObject.toLowerCase()) !== -1
        );
        const searchReports = searchObjects.map((reportCategory) => {
          const subCategories = reportCategory.subCategories.filter(
            (subCategory) =>
              subCategory.toLowerCase().indexOf(searchReport.toLowerCase()) !==
              -1
          );
          return { ...reportCategory, subCategories } as ReportCategory;
        });
        return searchReports;
      })
    );
  }

  updateSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  updateReportDefinitionName(subCategory: string) {
    this.reportService.updateReportDefinitionName(subCategory);
  }
}
