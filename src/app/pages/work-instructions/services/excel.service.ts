import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { image } from '../../../../assets/work-instructions-icons/svg/image.const';
import { coverImage } from '../../../../assets/work-instructions-icons/svg/ins-cover-image-placeholder';
import { InstructionService } from './instruction.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private instructionService: InstructionService,
              private spinner: NgxSpinnerService) {}

  public exportAsExcelFile(book, sheets, excelFileName: string): void {
    this.spinner.show();
    this.instructionService.getAllBusinessObjects()
      .pipe(
        map(businessObjects => {
          let objects = [];
          for (let businessObject of businessObjects) {
            objects = [...objects, businessObject.FIELDDESCRIPTION];
          }
          return objects;
        })
      ).subscribe(
        businessObjects => {
          this.spinner.hide();
          let assignedObjects = '';
          if (businessObjects.length) {
            assignedObjects = businessObjects.join(': {value}, ');
            assignedObjects = `${assignedObjects}: {value}`;
          }
          const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          const cols = [
            // tslint:disable-next-line:max-line-length
            { header: 'WorkInstruction', key: 'workInstruction', width: 38, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            // tslint:disable-next-line:max-line-length
            { header: 'AssignedObjects', key: 'assignedObjects', width: businessObjects.length ? 70 : 35, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Category', key: 'category', width: 25.7, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'SafetyKit', key: 'safetyKit', width: 29.89, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'SpareParts', key: 'spareParts', width: 42.33, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Tools', key: 'tools', width: 29.56, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Cover_Image_Name', key: 'cover_image_name', width: 44, height: 35,
              style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Cover_Image', key: 'cover_image', width: 44, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'StepTitle', key: 'stepTitle', width: 30.5, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Instruction', key: 'instruction', width: 38.89, height: 35,
              style: { font: { name: 'Calibri', size: 12,  bold: true } , alignment: { wrapText: true } } },
            { header: 'Warning', key: 'warning', width: 39.33, height: 35,
              style: { font: { name: 'Calibri', size: 12,  bold: true } , alignment: { wrapText: true } } },
            { header: 'ReactionPlan', key: 'reactionPlan', width: 35.3, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Hint', key: 'hint', width: 35.3, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Attachment_1_Name', key: 'attachment_1_name', width: 35.3, height: 35,
              style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Attachment_1', key: 'attachment_1', width: 35.3, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Attachment_2_Name', key: 'attachment_2_name', width: 35.3, height: 35,
              style: { font: { name: 'Calibri', size: 12,  bold: true } } },
            { header: 'Attachment_2', key: 'attachment_2', width: 35.3, height: 35, style: { font: { name: 'Calibri', size: 12,  bold: true } } },
          ];
          const sampleAttachmentImage = image;
          const sampleAttachmentImageId = book.addImage({
            base64: sampleAttachmentImage,
            extension: 'png',
          });
      
          const base64ForCoverImage = coverImage;
          const coverImageId = book.addImage({
            base64: base64ForCoverImage,
            extension: 'png',
          });
          for (let sheetCnt = 0; sheetCnt < sheets.length; sheetCnt++) {
            sheets[sheetCnt].columns = cols;
            sheets[sheetCnt].addRow({ workInstruction: 'Sample WorkInstruction' + (sheetCnt + 1), assignedObjects, category: 'Sample Category' + (sheetCnt + 1), safetyKit: 'Sample Kit1, Sample Kit2 ', spareParts: 'Sample Spare Part1, Sample Spare Part2', tools: 'Sample Tool1, Sample Tool2',  cover_image_name: 'doc-placeholder.png', cover_image: '', stepTitle: '', instruction: '', warning: '', reactionPlan: '', hint: '', attachment_1_name: '', attachment_1: '', attachment_2_name: '', attachment_2: '' });
            sheets[sheetCnt].addRow(
              { workInstruction: '', assignedObjects: '', category: '', safetyKit: '', spareParts: '', tools: '', cover_image: '', stepTitle: 'Sample Title1', instruction: '1. Sample Instruction1 \r\n2. Sample Instruction2', warning: '● Sample Warning1 \r\n● Sample Warning2', reactionPlan: 'Sample ReactionPlan', hint: 'Sample Hint', attachment_1_name: 'SampleImgWIMVP.jpg', attachment_1: '', attachment_2_name: 'SampleImgWIMVP.jpg',  attachment_2: '' });
            sheets[sheetCnt].addRow(
              { workInstruction: '', assignedObjects: '', category: '', safetyKit: '', spareParts: '', tools: '', cover_image: '', stepTitle: 'Sample Title2', instruction: '1. Sample Instruction1 \r\n2. Sample Instruction2', warning: '1. Sample Warning1 \r\n2. Sample Warning2', reactionPlan: 'Sample ReactionPlan', hint: 'Sample Hint', attachment_1_name: 'SampleImgWIMVP.jpg', attachment_1: '', attachment_2_name: 'SampleImgWIMVP.jpg',  attachment_2: '' });
            sheets[sheetCnt].addRow(
              { workInstruction: '', assignedObjects: '', category: '', safetyKit: '', spareParts: '', tools: '', cover_image: '', stepTitle: 'Sample Title3', instruction: '1. Sample Instruction1 \r\n2. Sample Instruction2', warning: '● Sample Warning1 \r\n● Sample Warning2', reactionPlan: 'Sample ReactionPlan', hint: 'Sample Hint', attachment_1_name: 'SampleImgWIMVP.jpg', attachment_1: '', attachment_2_name: 'SampleImgWIMVP.jpg',  attachment_2: '' });
            sheets[sheetCnt].properties.defaultRowHeight = 50;
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'O3:O3');
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'Q3:Q3');
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'O4:O4');
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'Q4:Q4');
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'O5:O5');
            sheets[sheetCnt].addImage(sampleAttachmentImageId, 'Q5:Q5');
            sheets[sheetCnt].addImage(coverImageId, {
              tl: { col: 7, row: 1 },
              ext: { width: 48, height: 48 }
            });
      
            // Comments for the cells
            sheets[sheetCnt].getCell('A1').note = 'Creates new WorkInstruction title. Please enter a unique WorkInstruction title. By default two instructions are created with "Sample WorkInstruction1" & "Sample WorkInstruction2"';
            sheets[sheetCnt].getCell('B1').note = 'Please replace {value} with the actual assigned object values.';
            sheets[sheetCnt].getCell('C1').note = 'A Category is assigned to the new WorkInstruction created here. By default, WorkInstruction goes under "Unassigned" category if no Category is provided. Available categories can be found in the "Categories" Dropdown under the Header section in the application';
            sheets[sheetCnt].getCell('D1').note = 'As a Prerequisite, necessary Safety and PPE kits should be mentioned here in order to complete the assigned job.';
            sheets[sheetCnt].getCell('E1').note = 'As a Prerequisite, necessary Spare parts should be mentioned here in order to complete the assigned job.';
            sheets[sheetCnt].getCell('F1').note = 'As a Prerequisite, necessary Tools should be mentioned here in order to complete the required job.';
            sheets[sheetCnt].getCell('G1').note = 'Add a name for the cover image to be uploaded in work instruction. By default, a sample cover image attachment added for work instruction in this template.';
            sheets[sheetCnt].getCell('H1').note = 'A default Cover Image is added for the Work Instruction created here. It can be changed with any relevant image as needed.';
            sheets[sheetCnt].getCell('I1').note = 'Enter a unique title for new step created here. User can create any number of steps. By default, three sample steps are created in this template. Modify title if required.';
            sheets[sheetCnt].getCell('J1').note = 'Add necessary instructions as numbered or bulleted list or as a paragraph to perform each step mentioned in the StepTitle column. By default, two sample instructions are created in this template. Add any number of instructions as required';
            sheets[sheetCnt].getCell('K1').note = 'Add any specific warnings as numbered or bulleted list or as a paragraph in each step. By default, two sample warnings are created in this template. Add any number of warnings as required.';
            sheets[sheetCnt].getCell('K1').note = 'Add Reaction Plan as numbered or bulleted list or as a paragraph in each step. By default, two sample reaction plans are added in this template. Add any number of Reaction Plans as required.';
            sheets[sheetCnt].getCell('M1').note = 'Add hints as numbered or bulleted list or as a paragraph in each step. By default, two sample hints are added in this template. Add any number of hints as required';
            sheets[sheetCnt].getCell('N1').note = 'Add a name for the first image to be uploaded in each step. By default, two sample image attachments are added for each step in this template. Add any number of attachments if required. Pictures can speak thousand words.';
            sheets[sheetCnt].getCell('O1').note = 'A first sample image attachment is added here for each step. By default, two sample image attachments are added for each step in this template. Add any number of attachments if required. Pictures can speak thousand words.';
            sheets[sheetCnt].getCell('P1').note = 'Add a name for the second image to be uploaded in each step. By default, two sample image attachments are added for each step in this template. Add any number of attachments if required. Pictures can speak thousand words.';
            sheets[sheetCnt].getCell('Q1').note = 'A second sample image attachment is added here for each step. By default, two sample image attachments are added for each step in this template. Add any number of attachments if required. Pictures can speak thousand words.';
      
            sheets[sheetCnt].getCell('E2').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in cover image.';

            sheets[sheetCnt].getCell('N3').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('O3').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';
            sheets[sheetCnt].getCell('P3').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('Q3').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';
      
            sheets[sheetCnt].getCell('N4').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('O4').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';
            sheets[sheetCnt].getCell('P4').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('Q4').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';
      
            sheets[sheetCnt].getCell('N5').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('O5').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';
            sheets[sheetCnt].getCell('P5').note = 'It is mandatory to write correct name here for the image attachment to be uploaded in each step.';
            sheets[sheetCnt].getCell('Q5').note = 'Upload an image attachment only with .jpeg/.jpg/.png format. Support for other image formats would be provided shortly.';

            if (businessObjects.length) {
              sheets[sheetCnt].getColumn(2).alignment = { vertical: 'middle', wrapText: true };
            }
      
            for (let rowCnt = 2; rowCnt <= 5; rowCnt++) {
              const row = sheets[sheetCnt].getRow(rowCnt);
              if (rowCnt === 2 && businessObjects.length) {
                const height = Math.ceil(businessObjects.length/2 * 20)
                row.height = height;
              } else {
                row.height = 50;
              }
              row.font = {name: 'Calibri', size: 12, bold: false};
            }
          }
      
          book.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {type: blobType});
            FileSaver.saveAs(blob, excelFileName);
          });
        }
      );

  }
}
