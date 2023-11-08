export interface Step {
  title: string;
  content: string;
  columnId?: string;
}

export interface StepperConfiguration {
  intermediaryJumpsAllowed: boolean;
  backButtonBehaviour: string;
}
