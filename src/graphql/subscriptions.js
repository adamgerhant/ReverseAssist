/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCollege = /* GraphQL */ `
  subscription OnCreateCollege($filter: ModelSubscriptionCollegeFilterInput) {
    onCreateCollege(filter: $filter) {
      id
      collegeId
      collegeName
      latitude
      longitude
      majors {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCollege = /* GraphQL */ `
  subscription OnUpdateCollege($filter: ModelSubscriptionCollegeFilterInput) {
    onUpdateCollege(filter: $filter) {
      id
      collegeId
      collegeName
      latitude
      longitude
      majors {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCollege = /* GraphQL */ `
  subscription OnDeleteCollege($filter: ModelSubscriptionCollegeFilterInput) {
    onDeleteCollege(filter: $filter) {
      id
      collegeId
      collegeName
      latitude
      longitude
      majors {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMajor = /* GraphQL */ `
  subscription OnCreateMajor($filter: ModelSubscriptionMajorFilterInput) {
    onCreateMajor(filter: $filter) {
      id
      name
      courseArr {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      collegeMajorsId
      __typename
    }
  }
`;
export const onUpdateMajor = /* GraphQL */ `
  subscription OnUpdateMajor($filter: ModelSubscriptionMajorFilterInput) {
    onUpdateMajor(filter: $filter) {
      id
      name
      courseArr {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      collegeMajorsId
      __typename
    }
  }
`;
export const onDeleteMajor = /* GraphQL */ `
  subscription OnDeleteMajor($filter: ModelSubscriptionMajorFilterInput) {
    onDeleteMajor(filter: $filter) {
      id
      name
      courseArr {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      collegeMajorsId
      __typename
    }
  }
`;
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse($filter: ModelSubscriptionCourseFilterInput) {
    onCreateCourse(filter: $filter) {
      id
      name
      articulatedColleges {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      majorCourseArrId
      __typename
    }
  }
`;
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse($filter: ModelSubscriptionCourseFilterInput) {
    onUpdateCourse(filter: $filter) {
      id
      name
      articulatedColleges {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      majorCourseArrId
      __typename
    }
  }
`;
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse($filter: ModelSubscriptionCourseFilterInput) {
    onDeleteCourse(filter: $filter) {
      id
      name
      articulatedColleges {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      majorCourseArrId
      __typename
    }
  }
`;
export const onCreateArticulationInformation = /* GraphQL */ `
  subscription OnCreateArticulationInformation(
    $filter: ModelSubscriptionArticulationInformationFilterInput
  ) {
    onCreateArticulationInformation(filter: $filter) {
      id
      college
      assistKey
      transferCourses {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      courseArticulatedCollegesId
      __typename
    }
  }
`;
export const onUpdateArticulationInformation = /* GraphQL */ `
  subscription OnUpdateArticulationInformation(
    $filter: ModelSubscriptionArticulationInformationFilterInput
  ) {
    onUpdateArticulationInformation(filter: $filter) {
      id
      college
      assistKey
      transferCourses {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      courseArticulatedCollegesId
      __typename
    }
  }
`;
export const onDeleteArticulationInformation = /* GraphQL */ `
  subscription OnDeleteArticulationInformation(
    $filter: ModelSubscriptionArticulationInformationFilterInput
  ) {
    onDeleteArticulationInformation(filter: $filter) {
      id
      college
      assistKey
      transferCourses {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      courseArticulatedCollegesId
      __typename
    }
  }
`;
export const onCreateTransferCourse = /* GraphQL */ `
  subscription OnCreateTransferCourse(
    $filter: ModelSubscriptionTransferCourseFilterInput
  ) {
    onCreateTransferCourse(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
export const onUpdateTransferCourse = /* GraphQL */ `
  subscription OnUpdateTransferCourse(
    $filter: ModelSubscriptionTransferCourseFilterInput
  ) {
    onUpdateTransferCourse(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
export const onDeleteTransferCourse = /* GraphQL */ `
  subscription OnDeleteTransferCourse(
    $filter: ModelSubscriptionTransferCourseFilterInput
  ) {
    onDeleteTransferCourse(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
