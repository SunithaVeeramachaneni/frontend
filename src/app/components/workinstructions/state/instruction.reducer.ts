import { createReducer, on } from "@ngrx/store";
import { InsToBePublished, Instruction } from "../../../interfaces/instruction";
import { Step } from "../../../interfaces/step";
import * as AppState from "../../../state/app.state";
import * as InstructionActions from "./intruction.actions";

export interface State extends AppState.State {
  instruction: InstructionState;
}

export interface StepImages {
  stepId: string;
  attachments: string;
  imageContents: string;
}

export interface InstructionState {
  instruction: Instruction;
  steps: Step[];
  stepImages: StepImages[];
  uploadedFile: string;
  currentStepId: string | null;
  insToBePublished: InsToBePublished[];
}

export const initialState: InstructionState = {
  instruction: {} as Instruction,
  steps: [],
  stepImages: [],
  uploadedFile: '',
  currentStepId: null,
  insToBePublished: []
};

const _instructionReducer = createReducer<InstructionState>(
  initialState,
  on(InstructionActions.addInstruction, (state, action): InstructionState => {
    return {
      ...state,
      instruction: { ...action.instruction }
    };
  }),
  on(InstructionActions.updateInstruction, (state, action): InstructionState => {
    return {
      ...state,
      instruction: { ...action.instruction }
    };
  }),
  on(InstructionActions.resetInstructionState, (state): InstructionState => {
    return {
      ...state,
      ...initialState
    };
  }),
  on(InstructionActions.addStep, (state, action): InstructionState => {
    const { StepId: currentStepId} = action.step;
    return {
      ...state,
      steps: [...state.steps, { ...action.step }],
      currentStepId
    };
  }),
  on(InstructionActions.updateStep, (state, action): InstructionState => {
    const updateSteps = state.steps.map(step => step.StepId === action.step.StepId ? action.step : step);
    const { StepId: currentStepId} = action.step;
    return {
      ...state,
      steps: updateSteps,
      currentStepId
    };
  }),
  on(InstructionActions.removeStep, (state, action): InstructionState => {
    const updateSteps = state.steps.filter(step => step.StepId !== action.step.StepId);
    return {
      ...state,
      steps: updateSteps,
      currentStepId: null
    };
  }),
  on(InstructionActions.updateSteps, (state, action): InstructionState => {
    return {
      ...state,
      steps: action.steps
    };
  }),
  on(InstructionActions.updateStepImages, (state, action): InstructionState => {
    let updateStepImages: StepImages[];
    const stepFound = state.stepImages.find(step => step.stepId === action.stepImages.stepId);
    if (stepFound) {
      updateStepImages = state.stepImages.map(step => step.stepId === action.stepImages.stepId ? action.stepImages : step);
    } else {
      updateStepImages = [...state.stepImages, { ...action.stepImages }];
    }
    return {
      ...state,
      stepImages: updateStepImages
    };
  }),
  on(InstructionActions.updateStepImagesContent, (state, action): InstructionState => {
    let updateStepImages: StepImages[];
    const { attachment, imageContent } = action;
    const stepFound = state.stepImages.find(step => step.stepId === state.currentStepId);
    if (stepFound) {
      updateStepImages = state.stepImages.map(step => step.stepId === state.currentStepId
        ? ({
          ...step,
          attachments: JSON.stringify([...JSON.parse(step.attachments), attachment]),
          imageContents: JSON.stringify([...JSON.parse(step.imageContents), imageContent])
        })
        : step);
    } else {
      updateStepImages = [...state.stepImages, {
        stepId: state.currentStepId,
        attachments: JSON.stringify([attachment]),
        imageContents: JSON.stringify([imageContent])
      }];
    }
    return {
      ...state,
      stepImages: updateStepImages
    };
  }),
  on(InstructionActions.removeStepImagesContent, (state, action): InstructionState => {
    let updateStepImages: StepImages[];
    const { attachment } = action;
    const stepDetails = state.stepImages.find(step => step.stepId === state.currentStepId);
    const attachments = JSON.parse(stepDetails.attachments).filter((att: string) => attachment !== att);
    const imageContents = JSON.parse(stepDetails.imageContents).filter((contents: any) => attachment !== contents.fileName);
    updateStepImages = state.stepImages.map(step => step.stepId === state.currentStepId
      ? ({
        ...step,
        attachments: JSON.stringify([...attachments]),
        imageContents: JSON.stringify([...imageContents])
      })
      : step);
    return {
      ...state,
      stepImages: updateStepImages
    };
  }),
  on(InstructionActions.removeStepImages, (state, action): InstructionState => {
    const updateStepImages = state.stepImages.filter(step => step.stepId !== action.stepId);
    return {
      ...state,
      stepImages: updateStepImages
    };
  }),
  on(InstructionActions.setUploadedFile, (state, action): InstructionState => {
    return {
      ...state,
      uploadedFile: action.uploadedFile
    };
  }),
  on(InstructionActions.setInsToBePublished, (state): InstructionState => {
    let insToBePublished: InsToBePublished[];
    const APPNAME = 'MWORKORDER';
    const { Categories: CATEGORY = '', WI_Name: FORMTITLE, Id, Published: PUBLISHED, Tools, SpareParts, SafetyKit, AssignedObjects }
      = state.instruction;
    const FORMNAME = `WI_${Id}`;

    let WIDETAILS = (AssignedObjects && Array.isArray(JSON.parse(AssignedObjects)))
      ? JSON.parse(AssignedObjects).map(assignedObject => {
        const { OBJECTCATEGORY: objectcategory, FILEDNAME: assignedto, Value: value } = assignedObject;
        return { objectcategory, assignedto, value };
      }) : [];
    WIDETAILS = WIDETAILS.length ? JSON.stringify(WIDETAILS) : '';

    let TOOLS: any = [];
    TOOLS = Tools ? [...TOOLS, JSON.parse(Tools)] : TOOLS;
    TOOLS = SafetyKit ? [...TOOLS, JSON.parse(SafetyKit)] : TOOLS;
    TOOLS = SpareParts ? [...TOOLS, JSON.parse(SpareParts)] : TOOLS;
    TOOLS = TOOLS.length ? JSON.stringify(TOOLS) : '';

    insToBePublished = [
      {
        CATEGORY,
        APPNAME,
        VERSION: '001',
        FORMTITLE,
        FORMNAME,
        UNIQUEKEY: 'STEP0',
        STEPS: '0',
        WINSTRIND: 'X',
        WIDETAILS,
        IMAGECONTENT: '',
        INSTRUCTION: '',
        TOOLS,
        PUBLISHED
      }
    ];

    const stepsToBePublished = state.steps.map((step, index) => {
      const { StepId, Published, Title: TITLE, Fields } = step;
      const fields = (Fields && Array.isArray(JSON.parse(Fields)))
        ? JSON.parse(Fields).map(field => {
          if (field.FieldValue && field.FieldValue.length) {
            return field;
          }
        }).filter(item => item) : [];
      const INSTRUCTION = JSON.stringify({ TITLE, Fields: fields });
      const stepImages = state.stepImages.find(stepImage => stepImage.stepId === StepId);
      const IMAGECONTENT = stepImages ? stepImages.imageContents : '';

      return {
        CATEGORY,
        APPNAME,
        VERSION: '001',
        FORMTITLE,
        FORMNAME,
        UNIQUEKEY: `${StepId}`,
        STEPS: `${index + 1}`,
        WINSTRIND: 'X',
        WIDETAILS: '',
        IMAGECONTENT,
        INSTRUCTION,
        TOOLS: '',
        PUBLISHED: Published
      };
    });

    insToBePublished = stepsToBePublished.length ? [...insToBePublished, ...stepsToBePublished] : insToBePublished;

    return {
      ...state,
      insToBePublished
    };
  })
);

export function instructionReducer(state: InstructionState, action) {
  return _instructionReducer(state, action);
}
