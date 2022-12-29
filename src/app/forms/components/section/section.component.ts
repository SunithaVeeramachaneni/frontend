import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  @Input() set sectionData(data) {
    this.sectionInfo = data;
    this.sectionForm.patchValue(this.sectionInfo);
  }
  get sectionData() {
    return this.sectionInfo;
  }
  @Output() addSectionEvent: EventEmitter<number> = new EventEmitter();

  isSectionOpenState = true;
  sectionInfo;

  sectionForm: FormGroup = this.fb.group({
    id: '',
    index: '',
    name: {
      value: '',
      disabled: true
    },
    position: ''
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  addSection(index) {
    this.addSectionEvent.emit(index);
  }

  toggleSectionOpenState = () => {
    this.isSectionOpenState = !this.isSectionOpenState;
  };

  editSection() {
    this.sectionForm.get('name').enable();
  }

  deleteSection() {}

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
