import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

   public workCenter: string = 'Mechanical';
   public workCenterList: string[] = ['Mechanical', 'Electrical'];

   public assignee: string = '';
   public assigneeList: string[] = ['Amy Butcher', 'Carlos Arnal', 'Steve Austin'];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

dismiss() {
    this.modalCtrl.dismiss();
  }
}