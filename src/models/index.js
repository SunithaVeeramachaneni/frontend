// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UnitMeasument, UnitList, Assets, Location, RoundPlanSubmissionDetails, RoundPlanSubmissionList, AuthoredRoundPlanDetail, RoundPlanDetail, RoundPlanList, ResponseSet, FormSubmissionDetail, AuthoredFormDetail, FormSubmissionList, FormList, FormDetail } = initSchema(schema);

export {
  UnitMeasument,
  UnitList,
  Assets,
  Location,
  RoundPlanSubmissionDetails,
  RoundPlanSubmissionList,
  AuthoredRoundPlanDetail,
  RoundPlanDetail,
  RoundPlanList,
  ResponseSet,
  FormSubmissionDetail,
  AuthoredFormDetail,
  FormSubmissionList,
  FormList,
  FormDetail
};