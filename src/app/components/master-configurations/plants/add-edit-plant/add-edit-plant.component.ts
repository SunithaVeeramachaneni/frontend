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
  styleUrls: ['./add-edit-plant.component.scss']
})
export class AddEditPlantComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdPlantData: EventEmitter<any> = new EventEmitter();
  @Input() set plantEditData(data) {
    this.plantsEditData = data;
    if (this.plantsEditData === null) {
      this.plantStatus = 'add';
      this.plantTitle = 'Create Location';
      this.plantButton = 'Create';
    } else {
      this.plantStatus = 'edit';
      this.plantTitle = 'Edit Location';
      this.plantButton = 'Update';
      this.plantImage = this.plantsEditData.image;
      const locdata = {
        id: this.plantsEditData.id,
        image: this.plantsEditData.image,
        name: this.plantsEditData.name,
        locationId: this.plantsEditData.locationId,
        model: this.plantsEditData.model,
        description: this.plantsEditData.description,
        parentId: this.plantsEditData.parentId
      };
      this.plantForm.patchValue(locdata);
      this.getAllPlants();
    }
  }
  get plantEditData() {
    return this.plantsEditData;
  }
  plantStatus;
  plantTitle;
  plantButton;
  plantImage;
  plantForm: FormGroup;
  parentInformation;
  allParentsData;
  private plantsEditData;
  constructor(private plantService: PlantService) {}

  ngOnInit(): void {}
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
    }
    // else if (this.plantStatus === 'edit') {
    //   const updateData = {
    //     data: this.plantForm.value,
    //     version: this.plantsEditData._version
    //   };
    //   this.plantService.updateLocation$(updateData).subscribe((res) => {
    //     this.createdPlantData.emit({
    //       status: this.plantStatus,
    //       data: res
    //     });
    //     this.plantForm.reset();
    //     this.slideInOut.emit('out');
    //   });
    // }
  }
  cancel() {
    this.slideInOut.emit('out');
  }
}
