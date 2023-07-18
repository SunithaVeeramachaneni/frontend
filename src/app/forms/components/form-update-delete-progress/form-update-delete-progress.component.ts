import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-update-delete-progress',
  templateUrl: './form-update-delete-progress.component.html',
  styleUrls: ['./form-update-delete-progress.component.scss']
})
export class FormUpdateDeleteProgressComponent implements OnInit {
  isOpen: Boolean = true;
  isFormListExpanded: Boolean = true;
  constructor() {}

  formMetadata = [
    {
      id: '15d6ccb5-ed39-4f29-a8c6-9dd5c4ecdeb2',
      name: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium, impedit!',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:54:29.100Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Draft',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'orc-1028 testhfgjhgfvwdj ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T07:04:34.509Z',
      updatedAt: '2023-07-17T04:53:25.094Z',
      _version: 22,
      lastModifiedBy: 'Kavya Krishna Koka',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '15d6ccb5-ed39-4f29-a8c6-9dd5c4ecdeb2',
      name: 'ORC-1028 Testhfgjhgfvwdj',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:54:29.100Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Draft',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'orc-1028 testhfgjhgfvwdj ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T07:04:34.509Z',
      updatedAt: '2023-07-17T04:53:25.094Z',
      _version: 22,
      lastModifiedBy: 'Kavya Krishna Koka',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '15d6ccb5-ed39-4f29-a8c6-9dd5c4ecdeb2',
      name: 'ORC-1028 Testhfgjhgfvwdj',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:54:29.100Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Draft',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'orc-1028 testhfgjhgfvwdj ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T07:04:34.509Z',
      updatedAt: '2023-07-17T04:53:25.094Z',
      _version: 22,
      lastModifiedBy: 'Kavya Krishna Koka',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '15d6ccb5-ed39-4f29-a8c6-9dd5c4ecdeb2',
      name: 'ORC-1028 Testhfgjhgfvwdj',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:54:29.100Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Draft',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'orc-1028 testhfgjhgfvwdj ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T07:04:34.509Z',
      updatedAt: '2023-07-17T04:53:25.094Z',
      _version: 22,
      lastModifiedBy: 'Kavya Krishna Koka',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '15d6ccb5-ed39-4f29-a8c6-9dd5c4ecdeb2',
      name: 'ORC-1028 Testhfgjhgfvwdj',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:54:29.100Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Draft',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'orc-1028 testhfgjhgfvwdj ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T07:04:34.509Z',
      updatedAt: '2023-07-17T04:53:25.094Z',
      _version: 22,
      lastModifiedBy: 'Kavya Krishna Koka',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '331e1198-1378-445a-8dc9-619d1a1c3eed',
      name: 'Testing',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T07:57:06.845Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Published',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Innovapptive Inc',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'testing ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T05:37:50.050Z',
      updatedAt: '2023-07-15T07:56:23.622Z',
      _version: 6,
      lastModifiedBy: 'Innovapptive Inc',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: 'b0c75fa4-9324-40e6-95bb-79cf47e4e0c3',
      name: 'CWP-2292 Test',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T05:44:28.962Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Published',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Kiran Palani',
      author: 'Innovapptive Inc',
      formType: 'Embedded',
      plantId: '0243dc89-35dc-49c1-8ae8-80f4d0ef5301',
      isArchived: false,
      searchTerm: 'cwp-2292 test ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T05:35:45.776Z',
      updatedAt: '2023-07-15T05:43:44.421Z',
      _version: 18,
      lastModifiedBy: 'Kiran Palani',
      plant:
        'CHROME_AT0001_14-07-23-10-31-10 - CHROME_AT_Plant_14-07-23-10-31-08',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    },
    {
      id: '88adb5a7-b9ad-4637-b4a2-104cedfc01a6',
      name: 'CWP-2292',
      description: '',
      formLogo: 'assets/rdf-forms-icons/formlogo.svg',
      isPublic: false,
      publishedDate: '2023-07-15T05:35:08.266Z',
      pdfTemplateConfiguration:
        '{"formId":true,"formTitle":true,"subject":true,"logo":true,"questionCompleted":true,"submittedOn":true,"submittedBy":true,"pdfGeneratedDate":true,"customText":true,"customTextLabel":"","customTextField":"","actions":true,"issues":true,"questions":true,"incompleteQuestions":true,"completedQuestions":true,"capturedQuestions":true,"photos":true,"skippedQuestions":true}',
      formStatus: 'Published',
      assignee: null,
      tags: [],
      additionalDetails: '[]',
      instructions: '{"notes":"","attachments":[],"pdfDocs":[]}',
      lastPublishedBy: 'Innovapptive Inc',
      author: 'Kiran Palani',
      formType: 'Embedded',
      plantId: '33db03fc-3097-4a0d-845f-ceb325066f79',
      isArchived: false,
      searchTerm: 'cwp-2292 ',
      isArchivedAt: null,
      isDeleted: false,
      createdAt: '2023-07-15T04:56:50.648Z',
      updatedAt: '2023-07-15T05:34:24.307Z',
      _version: 15,
      lastModifiedBy: 'Innovapptive Inc',
      plant:
        'CHROME_AT0001_14-07-23-02-01-52 - CHROME_AT_Plant_14-07-23-02-01-51',
      preTextImage: {
        image: 'assets/rdf-forms-icons/formlogo.svg',
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        },
        condition: true
      }
    }
  ].slice(0, 3);

  ngOnInit(): void {
    console.log(this.formMetadata);
  }

  toggleFormListExpanded() {
    this.isFormListExpanded = !this.isFormListExpanded;
  }

  closeFormProgressComponent() {
    this.isOpen = false;
  }
}
