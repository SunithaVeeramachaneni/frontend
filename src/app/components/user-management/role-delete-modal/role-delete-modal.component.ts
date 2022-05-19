import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-role-delete-modal',
  templateUrl: './role-delete-modal.component.html',
  styleUrls: ['./role-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleDeleteModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<RoleDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}

  cancelRole = (data) => {
    this.dialogRef.close(data);
  };
}
