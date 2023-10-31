// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { College, Major, Course, ArticulationInformation, transferCourse } = initSchema(schema);

export {
  College,
  Major,
  Course,
  ArticulationInformation,
  transferCourse
};