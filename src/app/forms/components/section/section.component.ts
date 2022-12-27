import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  // @Input() set pageIndex(index) {
  //   this.pageCount = index;
  //   console.log(this.pageCount);
  // }
  // get pageIndex() {
  //   return this.pageCount;
  // }

  @Input() indexes;
  isSectionOpenState = {};
  sectionForm: FormGroup;
  pageCount;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.pageCount);
    this.sectionForm = this.fb.group({
      sections: this.fb.array([this.initSection(1)])
    });
  }

  getSections(form) {
    return form.controls.sections.controls;
  }

  initSection = (sc: number, section = null, sectionName = null) => {
    if (!this.isSectionOpenState[sc]) this.isSectionOpenState[sc] = true;

    return this.fb.group({
      uid: [`uid${sc}`],
      name: [
        {
          value:
            section && sectionName === null
              ? `${section.get('name').value} Copy`
              : sectionName
              ? sectionName
              : `Section ${sc}`,
          disabled: true
        }
      ],
      position: ['']
    });
  };

  addSection(index: number, section: any = null, sectionName = null) {
    const control = this.sectionForm.get('sections') as FormArray;
    control.insert(
      index + 1,
      this.initSection(control.length + 1, section, sectionName)
    );
    //this.indexes.sectionIndex.push(index + 1);
    console.log(this.indexes);
  }

  toggleSectionOpenState = (idx: number) => {
    this.isSectionOpenState[idx + 1] = !this.isSectionOpenState[idx + 1];
  };

  editSection(e) {
    e.get('name').enable();
  }

  deleteSection(i, section) {
    const control = this.sectionForm.get('pages') as FormArray;
    control.removeAt(i);
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
