import { Step } from "./step";

export interface Instruction {
  Id: string;
  WI_Id: number;
  Categories: string;
  WI_Name: string;
  WI_Desc: string;
  Tools: string;
  Equipements: string;
  Locations: string;
  IsFavorite: boolean;
  CreatedBy: string;
  EditedBy: string;
  AssignedObjects: string;
  SpareParts: string;
  SafetyKit: string;
  created_at: string;
  updated_at: string;
  Published: boolean;
  IsPublishedTillSave: boolean;
  Cover_Image: string;
  IsFromAudioOrVideoFile: boolean;
  FilePath: string;
  FileType: string;
  categories?: string[];
}

export interface InstructionOptional {
  Id?: string;
  WI_Id: number;
  Categories: string;
  WI_Name: string;
  WI_Desc?: string;
  Tools?: string;
  Equipements?: string;
  Locations?: string;
  IsFavorite?: boolean;
  CreatedBy: string;
  EditedBy: string;
  AssignedObjects?: string;
  SpareParts?: string;
  SafetyKit?: string;
  created_at?: Date;
  updated_at?: Date;
  Published?: boolean;
  IsPublishedTillSave?: boolean;
  Cover_Image?: string;
  IsFromAudioOrVideoFile?: boolean;
  FilePath?: string;
  FileType?: string;
  categories?: string[];
}

export interface InsToBePublished {
  CATEGORY: string;
  APPNAME: string;
  VERSION: string;
  FORMTITLE: string;
  FORMNAME: string;
  UNIQUEKEY: string;
  STEPS: string;
  WINSTRIND: string;
  WIDETAILS: string;
  IMAGECONTENT: string;
  INSTRUCTION: string;
  TOOLS: string;
  PUBLISHED: boolean;
}

export interface PublishInstruction {
  wiToBePublsihed: InsToBePublished[];
  steps: Step[];
  wid: string;
  editedBy: string;
}
