import { InstructionState } from './instruction.reducer';
import {
  getCurrentStep,
  getCurrentStepId,
  getCurrentStepImages,
  getInsToBePublished,
  getInstruction,
  getInstructionId,
  getInstuctionFavFlag,
  getSteps,
  getUploadedFile,
} from './instruction.selectors';

describe('Instruction Selectors', () => {
  const instructionState: InstructionState = {
    instruction: {
      Id: '129',
      WI_Id: 2,
      Categories:
        '[{"Category_Id":35,"Category_Name":"Test Category","Cover_Image":"Clear_sky.jpg"}]',
      WI_Name: 'TestingNgRxChanges',
      WI_Desc: null,
      Tools:
        '{"Title":"Tools","Position":0,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Tools"]}',
      Equipements: null,
      Locations: null,
      IsFavorite: false,
      CreatedBy: 'kiran palani',
      EditedBy: 'kiran palani',
      AssignedObjects:
        '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"},{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUFNR","FIELDDESCRIPTION":"ORDER NUMBER","Value":"123456789"}]',
      SpareParts:
        '{"Title":"SpareParts","Position":2,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Spare Parts"]}',
      SafetyKit:
        '{"Title":"SafetyKit","Position":1,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test safety"]}',
      created_at: '2021-03-11T05:58:31.000Z',
      updated_at: '2021-03-11T06:47:09.000Z',
      Published: true,
      IsPublishedTillSave: true,
      Cover_Image: '../../assets/img/brand/doc-placeholder.png',
    },
    steps: [
      {
        StepId: '425',
        WI_Id: '129',
        Title: 'STEP1',
        Description: null,
        Status: null,
        Fields:
          '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step one instruction </p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>Step one warning</p>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Step one hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Step one reaction plan</p>"}]',
        Attachment: null,
        Instructions:
          '{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step one instruction </p>"}',
        Warnings:
        '{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>Step one warning</p>"}',
        Hints:
          '{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Step one hint</p>"}',
        isCloned: null,
        Reaction_Plan:
          '{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Step one reaction plan</p>"}',
        Published: true,
      },
      {
        StepId: '426',
        WI_Id: '129',
        Title: 'STEP2',
        Description: null,
        Status: null,
        Fields:
          '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":["doc-placeholder.png"]},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step two instruction</p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>step two warning </p>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>step two hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>step two reaction plan</p>"}]',
        Attachment: '["doc-placeholder.png"]',
        Instructions:
          '{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step two instruction</p>"}',
        Warnings:
          '{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>step two warning </p>"}',
        Hints:
          '{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>step two hint</p>"}',
        isCloned: null,
        Reaction_Plan:
          '{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>step two reaction plan</p>"}',
        Published: true,
      },
    ],
    stepImages: [
      {
        stepId: '426',
        attachments: '["doc-placeholder.png"]',
        imageContents:
          '[{"fileContent":"iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAABhVJREFUeF7tm8tv3FQUh3/3YY/teWUyiSratAg1oRISW1CrSlCJHRJL2LDoP8C/gsQOkBALNrBhQ4VEKyHRRaWKTVFXqAkr0qp5tJ3JvPy457DweJJMEzxtbEMn/pa2x2N/Pvcc33NnBADcunWr2Ww2PwJwXUr5NhE1pJQVIQSYGfOM1hpRFAHAn8z8YxRF31++fPk+AGZmiBs3brTOnDlzXWv9MRG9wcxNZraEEGrqXHNJEgRCiK7W+u8gCO6FYfj1lStXfmNm6OXl5Q+I6JNarfbucDhEFEUgounzzC3JCJFSNhzHeSsIgjXLsp7evXuXAdzWUspPAbzu+/6pk3MQIsJoNIIQwmLm95VSKwBuayHEe8zsBUFwauUAcSRFUZQMt/PM3AYAbVlW0xhzquUkjOWAmV0ANgDoxFrJPkIIC4AFALKUczRCCACAnNpeMmZS3aa2l0xRCkqhFJRCKSiFUlAKpaAUSkEplIJSKAWlUApKQU9vyJpkTpMHRcwjcxMkpYSUEkIICAFkdS/752IQMYgoV1G5CQrDEEEQIAyTJtT0ES8HcyxJKQXbtqG1zjVKMxckpUQYhuh0utje3sazZ10QmQwFMaSUcF0Xi4uLaLcX4brupPmeNZkKEkJMBO3s7GJraxu9Xn+8rJLNxTMDWitUKhX4fgCt1asjCIglhWGIbreL4XAI13VQrVahlDrxDSRR6Ps+er0+Op0OFhdb430ZhegUmQsCkgZ4nINarRZWVy+iVqshiqITDbU44Qtsbj7E+vrGoVWYk5z338hFEBBLIiIopVCvV9FoNGCMgVJq/LRfJJoEiMw4AgV2d59MhlRekZOQm6DkaTMzwjCCMQb9fh/9/gDGRDPfWFLSHcdBrVaDlBLGGAD5DauD5CboIEIIKCXR7/fx4MEGer0eLGu2r07edc6dO4u1tVUoVeyK+GxXmQH75b+DTqcD27anDzkSYwhEBq3WAoBiouYghQkyhuA4Ds6efQ0LCwvQerZIiHMZT6pV0QuchQiKq1qEarWKtbXVlyr3ybQlyT9FUYggIJaktYbnuZBSjpPv7ERRNFk7L5LCBCml0Ov1sL29M34fmjWXMJgBz3PRaDQgZbEdmkIECSGgtRpXsXX0envQ2po+7Eji2TphZWUF9Xp9fqtYkj/6/T663b0XrmKj0QjAXFcxA8dxsLJyDu12e+ZIYI77PUtLbQBzXcUMPM/D6urF6d1HwsyHEvKpqGJxk8uCEBLHz8Xi6QkRgYgQjyiRe+fwOAoTpJTCYDDA48dbCMPw2GpERNBaodFowvPcQ0PquM/kSSGCDlax9fUN7O3twbKOrmJhGMLzPFy69Cbq9dpzQ61oChEExJKSX5IOBoNjq1gQBBAinrEXXbGOojBBxhi4rosLF85jNFo+tooZY2DbNqrVauEJ+ShyF7TfFwJqtdrMVSzpJSWfB/YrWZGRlaugJHccvMG4o5g0wp4n2UdkQHT4oEROcr4iclNugphjIaPRCJubD7G7++TEQyaWA+zuPgUQV8a8yUWQlBKO48BxHAwGQ2xs/DV9yIlIhp7neahUKuNtUwdlRKaCkhc8265gaakNYwy63T0EgQ8ihpQnyx2JBCEAz/PQbi+iXq9DiPymIJkKAuILtSyNpaU2bNvGYDCAMfGKRFbJlZlh2zaazQZqtepkWx5kLigR4bouXNed3p0LObkBkIOghIMVJ6PAOQRz/DDyftPOTVDeF14Uxc/+XjFKQSmUglIoBaVQCkqhFJRCKSiFUlAKpaAUSkEplIJSkFm1IOYVbYwh+V+syP2PUUpNFimlEKLPzGEZSfsYYxCGIQBASim3mDkogyjupRMRMfMjIroPAJKZfwawU61WYdt2Zm3RVwkh4v+YeJ4HrbUE8Lsx5hsA0L7vf2tZ1tJgMFgmIouIlIh/fnFqGOdh9n0/IqLNKIp+McZ8BwDy5s2bf0RR9BURfcnM9wCM9v8uMN8IIUBEJKX0AWwT0a9E9LlS6qerV6/uAcDEwp07d96xLOszZv7QcZxWGIZz0TL9N4QQSfR0iegREf0wHA6/uHbt2jNgvAAx7xJOyj+bBxCeTXkcjQAAAABJRU5ErkJggg==","fileName":"doc-placeholder.png","fileType":".png"}]',
      },
    ],
    uploadedFile: 'doc-placeholder.png',
    currentStepId: '426',
    insToBePublished: [
      {
        CATEGORY:
          '[{"Category_Id":35,"Category_Name":"Test Category","Cover_Image":"Clear_sky.jpg"}]',
        APPNAME: 'MWORKORDER',
        VERSION: '001',
        FORMTITLE: 'TestingNgRxChanges',
        FORMNAME: 'WI_129',
        UNIQUEKEY: 'STEP0',
        STEPS: '0',
        WINSTRIND: 'X',
        WIDETAILS:
          '[{"objectcategory":"WORKORDER","assignedto":"AUART","value":"Test Order"},{"objectcategory":"WORKORDER","assignedto":"AUFNR","value":"123456789"}]',
        IMAGECONTENT: '',
        INSTRUCTION: '',
        TOOLS:
          '[{"Title":"Tools","Position":0,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Tools"]},{"Title":"SafetyKit","Position":1,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test safety"]},{"Title":"SpareParts","Position":2,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Spare Parts"]}]',
        PUBLISHED: true,
      },
      {
        CATEGORY:
          '[{"Category_Id":35,"Category_Name":"Test Category","Cover_Image":"Clear_sky.jpg"}]',
        APPNAME: 'MWORKORDER',
        VERSION: '001',
        FORMTITLE: 'TestingNgRxChanges',
        FORMNAME: 'WI_129',
        UNIQUEKEY: '425',
        STEPS: '1',
        WINSTRIND: 'X',
        WIDETAILS: '',
        IMAGECONTENT: '',
        INSTRUCTION:
          '{"TITLE":"STEP1","Fields":[{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step one instruction </p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>Step one warning</p>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Step one hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Step one reaction plan</p>"}]}',
        TOOLS: '',
        PUBLISHED: true,
      },
      {
        CATEGORY:
          '[{"Category_Id":35,"Category_Name":"Test Category","Cover_Image":"Clear_sky.jpg"}]',
        APPNAME: 'MWORKORDER',
        VERSION: '001',
        FORMTITLE: 'TestingNgRxChanges',
        FORMNAME: 'WI_129',
        UNIQUEKEY: '426',
        STEPS: '2',
        WINSTRIND: 'X',
        WIDETAILS: '',
        IMAGECONTENT:
          '[{"fileContent":"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","fileName":"doc-placeholder.png","fileType":".png"}]',
        INSTRUCTION:
          '{"TITLE":"STEP2","Fields":[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":["doc-placeholder.png"]},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step two instruction</p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<p>step two warning </p>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>step two hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>step two reaction plan</p>"}]}',
        TOOLS: '',
        PUBLISHED: true,
      },
    ],
  };

  it('Test', () => {
    expect(true).toBe(true);
  });

  it('should select instruction', () => {
    const instruction = getInstruction.projector(instructionState);
    expect(instruction).toEqual(instructionState.instruction);
  });

  it('should select instruction Id', () => {
    const id = getInstructionId.projector(instructionState);
    expect(id).toEqual(instructionState.instruction.Id);
  });

  it('should select instruction favorite falg', () => {
    const favFlag = getInstuctionFavFlag.projector(instructionState);
    expect(favFlag).toEqual(instructionState.instruction.IsFavorite);
  });

  it('should select instruction to be published data', () => {
    const insToBePublished = getInsToBePublished.projector(instructionState);
    expect(insToBePublished).toEqual(instructionState.insToBePublished);
  });

  it('should select current step id', () => {
    const stepId = getCurrentStepId.projector(instructionState);
    expect(stepId).toEqual(instructionState.currentStepId);
  });

  it('should select uploaded file', () => {
    const uploadedFile = getUploadedFile.projector(instructionState);
    expect(uploadedFile).toEqual(instructionState.uploadedFile);
  });

  it('should select current step images', () => {
    const stepId = getCurrentStepId.projector(instructionState);
    const stepImages = getCurrentStepImages.projector(instructionState, stepId);
    const currentStepImages = instructionState.stepImages.find(
      (stp) => stp.stepId === instructionState.currentStepId
    );
    expect(stepImages).toEqual(currentStepImages);
  });

  it('should select steps', () => {
    const steps = getSteps.projector(instructionState);
    expect(steps).toEqual(instructionState.steps);
  });

  it('should select current step', () => {
    const stepId = getCurrentStepId.projector(instructionState);
    const step = getCurrentStep.projector(instructionState, stepId);
    const currentStep = instructionState.steps.find(
      (stp) => stp.StepId === instructionState.currentStepId
    );
    expect(step).toEqual(currentStep);
  });
});
