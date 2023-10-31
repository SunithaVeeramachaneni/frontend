/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ValidationError } from 'src/app/interfaces';
import { AssetsService } from '../services/assets.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import {
  delay,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { FormValidationUtil } from 'src/app/shared/utils/formValidationUtil';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';

@Component({
  selector: 'app-add-edit-assets',
  templateUrl: './add-edit-assets.component.html',
  styleUrls: ['./add-edit-assets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditAssetsComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: false })
  searchInput: ElementRef<HTMLInputElement> = null;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdAssetsData: EventEmitter<any> = new EventEmitter();
  @Input() allPlants: any[];
  @Input() set allLocations(locations) {
    this._allLocations = locations.data;
  }

  get allLocations() {
    return this._allLocations;
  }
  @Input() set allAssets(assets) {
    this._allAssets = assets.data;
  }

  get allAssets() {
    return this._allAssets;
  }
  allLocations$: Observable<any>;
  private assetEditData = null;
  parentType: any = 'location';
  @Input() set assetsEditData(asset) {
    this.assetEditData = asset?.assetData || null;
    if (this.assetEditData === null) {
      this.assetStatus = 'add';
      this.assetTitle = 'Create Asset';
      this.assetButton = 'Create';
      this.assetImage = '';
      this.assetForm?.reset();
      this.assetForm?.get('parentType').setValue('location');
      this.assetForm?.get('assetsId').enable();
    } else {
      this.isCopy = asset?.isCopy;
      this.assetStatus = 'edit';
      this.assetTitle = 'Edit Asset';
      this.assetButton = 'Update';
      this.assetImage = this.assetEditData.image;
      if (this.isCopy) {
        this.assetStatus = 'add';
        this.assetTitle = 'Create Asset';
        this.assetButton = 'Create';
        this.assetForm.get('assetsId').enable();
      }
      const assetData = {
        id: this.assetEditData?.id,
        image: this.assetEditData?.image,
        name: this.assetEditData?.name,
        assetsId: this.assetEditData?.assetsId,
        model: this.assetEditData?.model,
        description: this.assetEditData?.description,
        parentType: this.assetEditData.parentType?.toLowerCase(),
        parentId: this.assetEditData?.parentId,
        plantsID: this.assetEditData?.plantsID
      };
      this.parentType = this.assetEditData.parentType?.toLowerCase();
      this.assetForm?.patchValue(assetData);
      if (!this.isCopy) {
        this.assetForm.get('assetsId').disable();
      }
    }
    if (
      this.assetEditData === null ||
      this.assetEditData.parentType?.toLowerCase() === 'location'
    ) {
      this.parentInformation = this.allLocations;
      this.allParentsData$.next(this.allLocations);
    } else if (this.assetEditData.parentType?.toLowerCase() === 'asset') {
      this.parentInformation = this.allAssets;
      this.allParentsData$.next(this.allAssets);
    }
  }
  get assetsEditData() {
    return this.assetEditData;
  }
  errors: ValidationError = {};
  assetForm: FormGroup;

  assetStatus;
  assetTitle;
  assetImage = '';

  assetButton;

  locations$;
  assets$;
  parentInformation;
  plantInformation;
  allParentsData;
  allParentsData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  allPlantsData;
  isCopy = false;
  assetIdExists = false;

  private _allAssets;
  private _allLocations;
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private assetService: AssetsService,
    private formValidationUtil: FormValidationUtil,
    private cdfr: ChangeDetectorRef,
    private tenantService: TenantService
  ) {}

  checkAssetsIdExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationError | null> => {
      control.markAsTouched();
      return control.valueChanges.pipe(
        delay(500),
        distinctUntilChanged(),
        switchMap((value) => {
          this.assetIdExists = false;
          return this.assetService.verifyAssetsId$(value);
        }),
        map((response) => {
          if (response.alreadyExists) {
            this.assetIdExists = true;
          } else {
            this.assetIdExists = false;
          }
          this.cdfr.markForCheck();
          return this.assetStatus !== 'edit'
            ? !this.assetIdExists
              ? null
              : { alreadyExists: true }
            : null;
        }),
        first()
      );
    };
  }
  getValidators(tenantInfo): any[] {
    const validators = [Validators.required, WhiteSpaceValidator.whiteSpace];
    if (tenantInfo.trimWhiteSpace) {
      validators.push(WhiteSpaceValidator.trimWhiteSpace);
    }
    return validators;
  }

  ngOnInit(): void {
    const tenantInfo = this.tenantService.getTenantInfo();
    this.assetForm = this.fb.group({
      image: '',
      name: new FormControl('', [...this.getValidators(tenantInfo)]),
      assetsId: new FormControl(
        '',
        [...this.getValidators(tenantInfo)],
        [this.checkAssetsIdExists()]
      ),
      model: new FormControl('', [WhiteSpaceValidator.trimWhiteSpace]),
      description: new FormControl('', [WhiteSpaceValidator.trimWhiteSpace]),
      parentType: 'location',
      parentId: ['', Validators.required],
      locationId: '',
      plantsID: new FormControl('', [Validators.required])
    });

    this.allPlantsData = this.allPlants;
    this.plantInformation = this.allPlants;
    this.parentInformation = this.allLocations;
    this.allParentsData = this.allLocations;
    this.assetForm
      .get('parentType')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.parentType = value;
      });
  }

  onSelectPlant(plantId) {
    const parentId = this.assetForm.get('parentId').value;
    const parentType = this.assetForm.get('parentType').value;

    if (parentType === 'location') {
      this.parentInformation = this.allLocations;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssets;
    }

    if (parentId) {
      this.allParentsData = this.parentInformation;
      this.allParentsData$.next(this.allParentsData);
    } else {
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === plantId
      );
      this.allParentsData$.next(this.allParentsData);
    }
  }

  onChangeParentType(event) {
    const parentType = event.value;
    const plantsID = this.assetForm.get('plantsID').value;

    // select parentData
    if (parentType === 'location') {
      this.parentInformation = this.allLocations;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssets;
    }

    // if plant is selected already
    if (plantsID) {
      this.allParentsData = this.parentInformation.filter(
        (parent) => parent?.plantsID === plantsID
      );
      this.allParentsData$.next(this.allParentsData);
    }
  }

  onSelectLocation(parentId) {
    const plantsID = this.assetForm.get('plantsID').value;
    const parentType = this.assetForm.get('parentType').value;

    if (parentType === 'location') {
      this.assetForm.get('locationId').setValue(parentId);
      this.parentInformation = this.allLocations;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssets;
    }
    if (!plantsID) {
      // set plant value if plant field was not selected first
      const parent = this.parentInformation.find((d) => d.id === parentId);
      if (parent?.plantsID) {
        this.assetForm.get('plantsID').setValue(parent.plantsID);
      }
    }
  }

  create() {
    if (this.assetStatus === 'add') {
      this.assetForm.get('image').setValue('');
      this.assetService.createAssets$(this.assetForm.value).subscribe((res) => {
        this.createdAssetsData.emit({
          status: this.assetStatus,
          data: res
        });
        this.resetSearchInput();
        this.assetForm.reset();
        this.assetForm?.get('parentType').setValue('location');
        this.slideInOut.emit('out');
      });
    } else if (this.assetStatus === 'edit') {
      this.assetService
        .updateAssets$({
          ...this.assetForm.value,
          _version: this.assetEditData._version,
          id: this.assetEditData?.id
        })
        .subscribe((res) => {
          this.createdAssetsData.emit({
            status: this.assetStatus,
            data: res
          });
          this.resetSearchInput();
          this.assetForm.reset();
          this.assetForm?.get('parentType').setValue('location');
          this.slideInOut.emit('out');
        });
    }
  }

  onKeyPlant(event) {
    const value = event.target.value || '';
    if (!value) {
      this.allPlantsData = this.plantInformation;
    } else {
      this.allPlantsData = this.searchPlant(value);
    }
  }

  onKey(event) {
    const value = event.target.value || '';
    if (!value) {
      const plantsID = this.assetForm.get('plantsID').value;
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === plantsID
      );
    } else {
      this.allParentsData = this.parentInformation;
      this.allParentsData = this.searchParent(value);
      this.allParentsData$.next(this.allParentsData);
    }
  }

  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.plantInformation.filter(
      (plant) =>
        (plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (plant.plantId &&
          plant.plantId.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  searchParent(value: string) {
    const plantsID = this.assetForm.get('plantsID').value;
    const parentType = this.assetForm.get('parentType').value;
    const searchValue = value.toLowerCase();

    if (parentType === 'location') {
      if (plantsID) {
        return this.allParentsData.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.locationId &&
              parent.locationId.toLowerCase().indexOf(searchValue) !== -1)
        );
      } else {
        return this.parentInformation.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.locationId &&
              parent.locationId.toLowerCase().indexOf(searchValue) !== -1)
        );
      }
    } else {
      if (plantsID) {
        return this.allParentsData.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.assetsId &&
              parent.assetsId.toLowerCase().indexOf(searchValue) !== -1)
        );
      } else {
        return this.parentInformation.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.assetsId &&
              parent.assetsId.toLowerCase().indexOf(searchValue) !== -1)
        );
      }
    }
  }

  cancel() {
    this.resetSearchInput();
    this.assetForm.reset();
    this.assetForm?.get('parentType').setValue('location');
    this.slideInOut.emit('out');
  }

  processValidationErrors(controlName: string): boolean {
    return this.formValidationUtil.processValidationErrors(
      controlName,
      this.assetForm,
      this.errors
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private resetSearchInput(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = '';
    }
    this.allPlantsData = this.plantInformation;
  }
}
