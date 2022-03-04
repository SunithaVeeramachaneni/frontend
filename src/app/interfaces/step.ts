export interface Step {
  StepId: string; 
  WI_Id: string;
  Title: string;
  Description: string;
  Status: string;
  Fields: string;
  Attachment: string;
  Instructions: string;
  Warnings: string;
  Hints: string;
  isCloned: boolean;
  Reaction_Plan: string;
  Published: boolean;
}

export interface StepOptional {
  StepId?: string;
  WI_Id: string;
  Title: string;
  Description?: string;
  Status?: string;
  Fields?: string;
  Attachment?: string;
  Instructions?: string;
  Warnings?: string;
  Hints?: string;
  isCloned?: boolean;
  Reaction_Plan?: string;
  Published?: boolean;
}
