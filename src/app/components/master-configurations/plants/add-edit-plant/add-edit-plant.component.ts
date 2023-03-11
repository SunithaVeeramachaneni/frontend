import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ListLocationsQuery } from 'src/app/API.service';
import { ValidationError } from 'src/app/interfaces';
import { PlantService } from '../services/plant.service';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrls: ['./add-edit-plant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditPlantComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdPlantData: EventEmitter<any> = new EventEmitter();
  allPlants$: Observable<ListLocationsQuery>;
  @Input() set plantEditData(data) {
    this.plantsEditData = data;
    if (this.plantsEditData === null) {
      this.plantStatus = 'add';
      this.plantTitle = 'Create Plant';
      this.plantButton = 'Create';
    } else {
      this.plantStatus = 'edit';
      this.plantTitle = 'Edit Plant';
      this.plantButton = 'Update';
      this.plantImage = this.plantsEditData.image;
      const plantdata = {
        id: this.plantsEditData.id,
        image: this.plantsEditData.image,
        name: this.plantsEditData.name,
        plantId: this.plantsEditData.plantId,
        description: this.plantsEditData.description,
        country: this.plantsEditData.country,
        state: this.plantsEditData.state,
        zipcode: this.plantsEditData.zipcode
      };
      this.plantForm.patchValue(plantdata);
      this.getAllPlants();
    }
  }
  get plantEditData() {
    return this.plantsEditData;
  }
  errors: ValidationError = {};
  plantStatus;
  plantTitle;
  plantButton;
  plantImage;
  plantForm: FormGroup;
  parentInformation;
  allParentsData;
  private plantsEditData;
  constructor(private fb: FormBuilder, private plantService: PlantService) {}

  ngOnInit(): void {
    this.plantForm = this.fb.group({
      id: '',
      image: '',
      name: new FormControl('', [Validators.required]),
      plantId: new FormControl('', [Validators.required]),
      country: '',
      zipcode: '',
      state: ''
    });
    this.getAllPlants();
  }
  getAllPlants() {
    this.plantService.fetchAllPlants$().subscribe((allLocations) => {
      this.parentInformation = allLocations.items.filter(
        (location) => location.id !== this.plantsEditData?.id
      );
      this.allParentsData = this.parentInformation;
    });
  }
  create() {
    if (this.plantStatus === 'add') {
      this.plantForm
        .get('image')
        .setValue('assets/master-configurations/default-location.png');
      this.plantService.createPlant$(this.plantForm.value).subscribe((res) => {
        this.createdPlantData.emit({
          status: this.plantStatus,
          data: res
        });
        this.plantForm.reset();
        this.slideInOut.emit('out');
      });
    } else if (this.plantStatus === 'edit') {
      const updateData = {
        data: this.plantForm.value,
        version: this.plantsEditData._version
      };
      this.plantService.updatePlant$(updateData).subscribe((res) => {
        this.createdPlantData.emit({
          status: this.plantStatus,
          data: res
        });
        this.plantForm.reset();
        this.slideInOut.emit('out');
      });
    }
  }
  cancel() {
    this.slideInOut.emit('out');
    this.plantForm.reset();
  }
  processValidationErrors(controlName: string): boolean {
    const touched = this.plantForm.get(controlName).touched;
    const errors = this.plantForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }
}
