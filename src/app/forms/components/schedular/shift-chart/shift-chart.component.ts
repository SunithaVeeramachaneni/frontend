import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss']
})
export class ShiftChartComponent implements OnInit {
  @Input() slots: string[] = [];
  @Input() col = 0;
  dataArrays: any = [];
  startTimeForLastSlot: any;
  addForm: FormGroup;
  itemForm: FormGroup;
  colSpanVal: any;
  slotsArray: FormArray;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      items: [null, Validators.required]
    });
    this.slotsArray = this.fb.array([]);
  }

  toggleSlot(val: any, idx) {
    for (const data of this.dataArrays) {
      idx = Math.abs(data.index - idx);
    }

    // Example usage
    const subtractedTime = this.subtractTime(val, 0, 1);
    const subtractedTimeStart = this.subtractTime(val, idx, 0);
    this.startTimeForLastSlot = val;
    this.colSpanVal = this.slots.indexOf(val) + 1;
    this.col = this.slots.length - this.colSpanVal;
    const myObj = {
      startTime: val,
      startTime1: subtractedTimeStart,
      index: idx,
      cols: this.colSpanVal,
      endTime: subtractedTime
    };
    this.dataArrays.push(myObj);
    this.slotsArray.push(this.createItemFormGroup());
    console.log(this.dataArrays);
  }

  onAddRow() {
    this.slotsArray.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.slotsArray.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      startTime: null,
      endTime: null,
      qty: null,
      colspan: null
    });
  }

  subtractTime(timeString, subtractHours, subtractMinutes) {
    // Split the time string into hours, minutes, and AM/PM indicator
    const [timePart, ampmPart] = timeString.split(' ');
    const [hoursStr, minutesStr] = timePart.split(':');

    // Convert the string values to numbers
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);

    // Adjust the hours based on the AM/PM indicator
    if (ampmPart.toLowerCase() === 'pm') {
      hours += 12;
    }

    // Subtract the specified hours and minutes
    hours -= subtractHours;
    minutes -= subtractMinutes;

    // Adjust the time components if necessary
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 12;
    }

    // Convert the hours back to a 12-hour format
    let ampm = 'AM';
    if (hours >= 12) {
      ampm = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    // Format the resulting time as a string
    const updatedTimeString = `${this.padZero(hours)}:${this.padZero(
      minutes
    )} ${ampm}`;

    return updatedTimeString;
  }

  // Helper function to pad single-digit numbers with a leading zero
  padZero(val: number) {
    return val?.toString().padStart(2, '0');
  }

  get slotsControls() {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }
}
