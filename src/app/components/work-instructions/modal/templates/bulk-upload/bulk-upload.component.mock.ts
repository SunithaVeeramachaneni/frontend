export const businessObjects = [
  {
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'AUART',
    FIELDDESCRIPTION: 'ORDER TYPE',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'AUFNR',
    FIELDDESCRIPTION: 'ORDER NUMBER',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'EQUNR',
    FIELDDESCRIPTION: 'EQUIPMENT NUMBER',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'PLNNR',
    FIELDDESCRIPTION: 'KEY FOR TASK LIST GROUP',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'PLNTY',
    FIELDDESCRIPTION: 'TASK LIST TYPE',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'NOTIFICATION',
    FILEDNAME: 'QMART',
    FIELDDESCRIPTION: 'NOTIFICATION TYPE',
    Value: ''
  },
  {
    OBJECTCATEGORY: 'NOTIFICATION',
    FILEDNAME: 'QMNUM',
    FIELDDESCRIPTION: 'NOTIFICATION NO',
    Value: ''
  }
];

export const category1 = {
  Category_Id: 'ighqwdf',
  Category_Name: 'Sample Category1',
  Cover_Image:
    'assets/work-instructions-icons/img/brand/category-placeholder.png'
};

export const category2 = {
  Category_Id: 'dggqwgh',
  Category_Name: 'Sample Category2',
  Cover_Image:
    'assets/work-instructions-icons/img/brand/category-placeholder.png'
};

export const category3 = {
  Category_Id: 'rtyjukl',
  Category_Name: 'Sample Category3',
  Cover_Image:
    'assets/work-instructions-icons/img/brand/category-placeholder.png'
};

export const userDetails = {
  first_name: 'Test',
  last_name: 'User'
};

export const inst1Details = {
  AssignedObjects:
    '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"},{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"EQUNR","FIELDDESCRIPTION":"EQUIPMENT NUMBER","Value":"12345"}]',
  Categories: '["ighqwdf"]',
  CreatedBy: 'Test User',
  created_at: '',
  EditedBy: 'Test User',
  IsFavorite: false,
  IsPublishedTillSave: false,
  Published: false,
  SafetyKit:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2"]}',
  SpareParts:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}',
  Tools:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}',
  Cover_Image: 'assets/work-instructions-icons/img/brand/doc-placeholder.png',
  WI_Desc: null,
  WI_Id: null,
  WI_Name: 'Sample WorkInstruction1',
  updated_at: '',
  Equipements: null,
  Locations: null,
  IsAudioOrVideoFileDeleted: false,
  IsFromAudioOrVideoFile: false,
  FilePath: null,
  FileType: null,
  Id: null
};

export const inst2Details = {
  AssignedObjects: null,
  Categories: '["dggqwgh"]',
  CreatedBy: 'Test User',
  created_at: '',
  EditedBy: 'Test User',
  IsFavorite: false,
  IsPublishedTillSave: false,
  Published: false,
  SafetyKit:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2"]}',
  SpareParts:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}',
  Tools:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}',
  Cover_Image: 'doc-placeholder.png',
  WI_Desc: null,
  WI_Id: null,
  WI_Name: 'Sample WorkInstruction2',
  updated_at: '',
  Equipements: null,
  Locations: null,
  IsAudioOrVideoFileDeleted: false,
  IsFromAudioOrVideoFile: false,
  FilePath: null,
  FileType: null,
  Id: null
};

export const inst3Details = {
  AssignedObjects: null,
  Categories: '["rtyjukl"]',
  CreatedBy: 'Test User',
  created_at: '',
  EditedBy: 'Test User',
  IsFavorite: false,
  IsPublishedTillSave: false,
  Published: false,
  SafetyKit:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2"]}',
  SpareParts:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}',
  Tools:
    '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}',
  Cover_Image: 'assets/work-instructions-icons/img/brand/doc-placeholder.png',
  WI_Desc: null,
  WI_Id: null,
  WI_Name: 'Sample WorkInstruction3',
  updated_at: '',
  Equipements: null,
  Locations: null,
  IsAudioOrVideoFileDeleted: false,
  IsFromAudioOrVideoFile: false,
  FilePath: null,
  FileType: null,
  Id: null
};

export const inst1Resp = {
  ...inst1Details,
  WI_Id: 6,
  created_at: '2021-09-29T09:54:08.976Z',
  updated_at: '2021-09-29T09:54:08.976Z',
  Id: 'lBgUyIIOV'
};

export const inst3Resp = {
  ...inst3Details,
  WI_Id: 7,
  created_at: '2021-09-29T09:54:08.976Z',
  updated_at: '2021-09-29T09:54:08.976Z',
  Id: 'jkgUyIIOV'
};

export const inst1StepDetails = [
  {
    Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP1.jpg"]',
    Description: null,
    Hints:
      '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
    Instructions:
      '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
    Published: false,
    Reaction_Plan:
      '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
    Status: null,
    StepId: '',
    Title: 'Sample Title1',
    WI_Id: 'lBgUyIIOV',
    Warnings:
      '{"Title":"Warning","Active":"true","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
    Fields:
      '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":["SampleImgWIMVP.jpg","SampleImgWIMVP1.jpg"]},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
    isCloned: null
  },
  {
    Attachment: null,
    Description: null,
    Hints:
      '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
    Instructions:
      '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
    Published: false,
    Reaction_Plan:
      '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
    Status: null,
    StepId: '',
    Title: 'Sample Title2',
    WI_Id: 'lBgUyIIOV',
    Warnings:
      '{"Title":"Warning","Active":"true","FieldValue":"<ol><li>Sample Warning1</li><li>Sample Warning2</li></ol>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
    Fields:
      '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ol><li>Sample Warning1</li><li>Sample Warning2</li></ol>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
    isCloned: null
  },
  {
    Attachment: null,
    Description: null,
    Hints:
      '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
    Instructions:
      '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
    Published: false,
    Reaction_Plan:
      '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
    Status: null,
    StepId: '',
    Title: 'Sample Title3',
    WI_Id: 'lBgUyIIOV',
    Warnings:
      '{"Title":"Warning","Active":"true","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
    Fields:
      '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
    isCloned: null
  }
];

const [step1, step2, step3] = inst1StepDetails;
export const inst1StepResp = [
  { ...step1, StepId: 'stepone' },
  { ...step2, StepId: 'steptwo' },
  { ...step3, StepId: 'stepthree' }
];
