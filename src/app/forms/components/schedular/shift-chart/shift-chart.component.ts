import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShiftService } from 'src/app/components/master-configurations/shifts/services/shift.service';
@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss']
})
export class ShiftChartComponent implements OnInit {
  shiftsInformation = [];
  allShiftsData = [];
  shifts = new FormControl('');
  shiftsList: string[] = ['Shift A', 'Shift B', 'Shift C'];
  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.getAllShiftsData();
  }

  getAllShiftsData() {
    this.shiftService.fetchAllShifts$().subscribe((shifts) => {
      this.allShiftsData = shifts.items || [];
      this.shiftsInformation = this.allShiftsData;
    });
    console.log(this.allShiftsData, this.shiftsInformation);
  }
}
