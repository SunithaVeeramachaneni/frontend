import {
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  pairwise,
  tap
} from 'rxjs/operators';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  @Input() indexes;
  isPageOpenState = {};
  pageForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.pageForm = this.fb.group({
      pages: this.fb.array([this.initPage(1)])
    });

    this.route.data.subscribe(({ form }) => {
      console.log(form);
      if (form && Object.keys(form).length) {
        this.pageForm.patchValue(form, { emitEvent: false });
        const { pages } = form;

        (this.pageForm.get('pages') as FormArray).removeAt(0);

        pages.forEach((page, index) => {
          const { uid, name, position } = page;
          const pc = index + 1;
          if (!this.isPageOpenState[pc]) this.isPageOpenState[pc] = true;

          (this.pageForm.get('pages') as FormArray).push(
            this.fb.group({
              uid,
              name: [{ value: name, disabled: true }],
              position
            })
          );
        });

        //this.disableFormFields = false;
      }
    });
  }

  getPages(form) {
    return form.controls.pages.controls;
  }

  initPage = (pc: number, page = null, pageName = null) => {
    if (!this.isPageOpenState[pc]) this.isPageOpenState[pc] = true;

    return this.fb.group({
      uid: [`uid${pc}`],
      name: [
        {
          value:
            page && pageName === null
              ? `${page.get('name').value} Copy`
              : pageName
              ? pageName
              : `Page ${pc}`,
          disabled: true
        }
      ],
      position: ['']
    });
  };

  addPage(index: number, page: any = null, pageName = null) {
    const control = this.pageForm.get('pages') as FormArray;
    control.insert(
      index + 1,
      this.initPage(control.length + 1, page, pageName)
    );
    this.indexes.push({
      pageIndex: index + 1,
      sectionIndex: [1],
      questionIndex: [1]
    });
    console.log(this.indexes);
  }

  togglePageOpenState = (idx: number) => {
    this.isPageOpenState[idx + 1] = !this.isPageOpenState[idx + 1];
  };

  editPage(e) {
    e.get('name').enable();
  }

  deletePage(i, page) {
    const control = this.pageForm.get('pages') as FormArray;
    control.removeAt(i);
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
}
