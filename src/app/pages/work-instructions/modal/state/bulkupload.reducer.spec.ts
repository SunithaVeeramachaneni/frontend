import { Instruction } from '../../../../interfaces';
import * as BulkuploadReducer from './bulkupload.reducer';
import { BulkuploadState } from './bulkupload.reducer';
import * as BulkUploadActions from './bulkupload.actions';

describe('Bulkupload Reducer', () => {
  const { initialState, bulkuploadReducer } = BulkuploadReducer;
  const bulkuploadState: BulkuploadState = {
    instructionsWithSteps: [
      {
        instruction: {
          Categories: '[{"Category_Id":33,"Category_Name":"Sample Category1","Cover_Image":"Safety.jpg"}]',
          CreatedBy: 'kiran palani',
          created_at: '',
          EditedBy: 'kiran palani',
          IsFavorite: false,
          IsPublishedTillSave: false,
          Published: false,
          SafetyKit: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2 "]}',
          SpareParts: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}',
          Tools: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}',
          Cover_Image: 'doc-placeholder.png',
          WI_Desc: null,
          WI_Id: 7,
          WI_Name: 'Sample WorkInstruction1Copy(2)',
          updated_at: '',
          Id: '134'
        } as Instruction,
        steps: [
          {
            Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]',
            Description: null,
            Hints: '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
            Instructions: '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
            Published: false,
            Reaction_Plan: '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
            Status: null,
            StepId: '448',
            Title: 'Sample Title1',
            WI_Id: '134',
            Warnings: '{"Title":"Warning","Active":"true","FieldValue":"<ul><li> Sample Warning1 \\r\\n</li><li> Sample Warning2</li></ul>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
            Fields: '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":"[\\"SampleImgWIMVP.jpg\\",\\"SampleImgWIMVP.jpg\\"]"},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 \\r\\n</li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
            isCloned: null
          },
          {
            Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]',
            Description: null,
            Hints: '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
            Instructions: '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
            Published: false,
            Reaction_Plan: '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
            Status: null,
            StepId: '450',
            Title: 'Sample Title2',
            WI_Id: '134',
            Warnings: '{"Title":"Warning","Active":"true","FieldValue":"<ol><li>Sample Warning1 \\r</li><li>Sample Warning2</li></ol>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
            Fields: '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":"[\\"SampleImgWIMVP.jpg\\",\\"SampleImgWIMVP.jpg\\"]"},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ol><li>Sample Warning1 \\r</li><li>Sample Warning2</li></ol>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
            isCloned: null
          },
          {
            Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]',
            Description: null,
            Hints: '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
            Instructions: '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
            Published: false,
            Reaction_Plan: '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
            Status: null,
            StepId: '452',
            Title: 'Sample Title3',
            WI_Id: '134',
            Warnings: '{"Title":"Warning","Active":"true","FieldValue":"<ul><li> Sample Warning1 \\r\\n</li><li> Sample Warning2</li></ul>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
            Fields: '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":"[\\"SampleImgWIMVP.jpg\\",\\"SampleImgWIMVP.jpg\\"]"},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1 \\r</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 \\r\\n</li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
            isCloned: null
          }
        ]
      }
    ]
  };

  it('should return initial state for unknown action', () => {
    const action = {
      type: 'Unknown'
    };
    const state = bulkuploadReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('should add instructionsWithSteps in the state', () => {
    const { instructionsWithSteps } = bulkuploadState;
    const { instruction, steps } = instructionsWithSteps[0];
    const action = BulkUploadActions.addInstructionWithSteps({ instruction, steps });
    const state = bulkuploadReducer(initialState, action);
    expect(state).toEqual({ ...initialState, instructionsWithSteps });
  });

  it('should reset bulkupload state', () => {
    const { instructionsWithSteps } = bulkuploadState;
    const action = BulkUploadActions.resetInstructionWithSteps();
    const state = bulkuploadReducer({...initialState, instructionsWithSteps }, action);
    expect(state).toEqual(initialState);
  });

});
