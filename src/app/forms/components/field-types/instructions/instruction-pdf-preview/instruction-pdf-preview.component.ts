import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-instruction-pdf-preview',
  templateUrl: './instruction-pdf-preview.component.html',
  styleUrls: ['./instruction-pdf-preview.component.scss']
})
export class InstructionPdfPreviewComponent implements OnInit {
  @Input() pdf;

  constructor() {}

  ngOnInit(): void {}
}
