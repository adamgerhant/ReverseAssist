import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerCollege = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<College, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly collegeId: number;
  readonly collegeName: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly majors?: (Major | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCollege = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<College, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly collegeId: number;
  readonly collegeName: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly majors: AsyncCollection<Major>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type College = LazyLoading extends LazyLoadingDisabled ? EagerCollege : LazyCollege

export declare const College: (new (init: ModelInit<College>) => College) & {
  copyOf(source: College, mutator: (draft: MutableModel<College>) => MutableModel<College> | void): College;
}

type EagerMajor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Major, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly courseArr?: (Course | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly collegeMajorsId?: string | null;
}

type LazyMajor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Major, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly courseArr: AsyncCollection<Course>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly collegeMajorsId?: string | null;
}

export declare type Major = LazyLoading extends LazyLoadingDisabled ? EagerMajor : LazyMajor

export declare const Major: (new (init: ModelInit<Major>) => Major) & {
  copyOf(source: Major, mutator: (draft: MutableModel<Major>) => MutableModel<Major> | void): Major;
}

type EagerCourse = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Course, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly articulatedColleges?: (ArticulationInformation | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly majorCourseArrId?: string | null;
}

type LazyCourse = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Course, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly articulatedColleges: AsyncCollection<ArticulationInformation>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly majorCourseArrId?: string | null;
}

export declare type Course = LazyLoading extends LazyLoadingDisabled ? EagerCourse : LazyCourse

export declare const Course: (new (init: ModelInit<Course>) => Course) & {
  copyOf(source: Course, mutator: (draft: MutableModel<Course>) => MutableModel<Course> | void): Course;
}

type EagerArticulationInformation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ArticulationInformation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly college: number;
  readonly assistKey: number;
  readonly transferCourses?: (transferCourse | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly courseArticulatedCollegesId?: string | null;
}

type LazyArticulationInformation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ArticulationInformation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly college: number;
  readonly assistKey: number;
  readonly transferCourses: AsyncCollection<transferCourse>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly courseArticulatedCollegesId?: string | null;
}

export declare type ArticulationInformation = LazyLoading extends LazyLoadingDisabled ? EagerArticulationInformation : LazyArticulationInformation

export declare const ArticulationInformation: (new (init: ModelInit<ArticulationInformation>) => ArticulationInformation) & {
  copyOf(source: ArticulationInformation, mutator: (draft: MutableModel<ArticulationInformation>) => MutableModel<ArticulationInformation> | void): ArticulationInformation;
}

type EagertransferCourse = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<transferCourse, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly articulationInformationTransferCoursesId?: string | null;
}

type LazytransferCourse = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<transferCourse, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly articulationInformationTransferCoursesId?: string | null;
}

export declare type transferCourse = LazyLoading extends LazyLoadingDisabled ? EagertransferCourse : LazytransferCourse

export declare const transferCourse: (new (init: ModelInit<transferCourse>) => transferCourse) & {
  copyOf(source: transferCourse, mutator: (draft: MutableModel<transferCourse>) => MutableModel<transferCourse> | void): transferCourse;
}