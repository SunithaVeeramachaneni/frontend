import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PositionsService } from '../services/positions.service';
import { UserGroupService } from '../services/user-group.service';

@Component({
  selector: 'app-select-user-group-positions-modal',
  templateUrl: './select-user-group-positions-modal.component.html',
  styleUrls: ['./select-user-group-positions-modal.component.scss']
})
export class SelectUserGroupPositionsModalComponent implements OnInit {
  type: string;
  allPositions = [];
  positions = this.allPositions;
  selectedPositions = [];
  positionFilterInput = '';
  isLoading = false;
  isCreateUpdateLoading = false;
  disableBtn: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectUserGroupPositionsModalComponent>,
    private positionService: PositionsService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.isLoading = true;
    this.isCreateUpdateLoading = false;
    this.getPositions();
    this.disableBtn = true;
  }

  getPositions() {
    this.positionService
      .getPositionsList$(
        {
          next: '',
          limit: 250,
          searchKey: '',
          fetchType: 'load'
        },
        {
          plant: this.data.plantId
        }
      )
      .subscribe((res) => {
        this.isLoading = false;
        this.allPositions = this.getUpdatedPositions(res?.rows) || [];
        this.disableBtn = this.checkIfBtnDisabled();
        this.positions = this.allPositions;
      });
  }

  getUpdatedPositions(positions) {
    return positions.map((pos) => ({
      ...pos,
      checked: this.checkIsChecked(pos.id)
    }));
  }

  checkIsChecked(posId) {
    if (this.data?.selectedUserGroup?.positionIds) {
      const res = this.data.selectedUserGroup.positionIds
        .split(',')
        .some((pos) => pos === posId);
      return res;
    }
    return false;
  }

  checkIfBtnDisabled() {
    const initial = this.data?.selectedUserGroup?.positionIds
      ? this.data?.selectedUserGroup?.positionIds?.split(',')
      : [];
    const selected = this.getSeletectedPositions();

    if (initial?.length !== selected?.length) {
      return false;
    }
    return initial
      .map((data1) => data1)
      .every((element) => selected.map((data2) => data2.id).includes(element));
  }

  getSeletectedPositions() {
    return this.allPositions.filter((pos) => pos.checked);
  }

  togglePositionCheckbox(checkStatus, position) {
    this.allPositions = this.allPositions.map((pos) =>
      pos.id === position.id
        ? {
            ...pos,
            checked: checkStatus
          }
        : pos
    );

    this.positions = this.allPositions;
    this.disableBtn = this.checkIfBtnDisabled();
    if (this.positionFilterInput) {
      this.onKeyPosition({ target: { value: this.positionFilterInput } });
    }
  }

  onKeyPosition(event) {
    this.positionFilterInput = event.target.value.trim() || '';
    if (this.positionFilterInput) {
      this.positions = this.positions.filter((pos) =>
        pos.name.toLowerCase().includes(this.positionFilterInput.toLowerCase())
      );
    } else {
      this.positions = this.allPositions;
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      isBack: true,
      returnType: 'cancel'
    });
  }

  onCreate(): void {
    this.isCreateUpdateLoading = true;
    const selectedPositionIds = [];
    this.getSeletectedPositions().forEach((pos) => {
      selectedPositionIds.push(pos.id);
    });

    const newUserGroup = {
      type: this.data.selectedGroupType || 'positions',
      name: this.data?.name ?? '',
      description: this.data?.description ?? '',
      plantId: this.data?.plantId,
      unitId: this.data?.unitId ?? '',
      positionIds: selectedPositionIds.join(),
      searchTerm: `${this.data?.name?.toLowerCase() ?? ''} ${
        this.data?.description?.toLowerCase() ?? ''
      }`
    };

    this.userGroupService
      .createUserGroup$(newUserGroup, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((data) => {
        this.isCreateUpdateLoading = false;
        if (Object.keys(data).length > 0) {
          this.userGroupService.addUpdateDeleteCopyUserGroup = true;
          this.userGroupService.userGroupActions$.next({
            action: 'add',
            group: { ...data, usersCount: data?.users?.length }
          });
        }
      });
    this.dialogRef.close({
      isBack: false
    });
  }

  onUpdate() {
    this.isCreateUpdateLoading = true;
    const selectedPositionIds = [];
    this.getSeletectedPositions().forEach((pos) => {
      selectedPositionIds.push(pos.id);
    });
    const payload = {
      positionIds: selectedPositionIds.join(',')
    };
    this.userGroupService
      .updateUserGroup$(this.data?.userGroupId, payload, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe(() => {
        this.isCreateUpdateLoading = false;
        this.userGroupService.addUpdateDeleteCopyUserGroup = true;
        this.userGroupService.userGroupActions$.next({
          action: 'edit',
          group: { ...this.data.selectedUserGroup, ...payload }
        });
        this.dialogRef.close({ returnType: 'done' });
      });
  }
}
