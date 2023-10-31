/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCollege = /* GraphQL */ `
  mutation CreateCollege(
    $input: CreateCollegeInput!
    $condition: ModelCollegeConditionInput
  ) {
    createCollege(input: $input, condition: $condition) {
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
export const updateCollege = /* GraphQL */ `
  mutation UpdateCollege(
    $input: UpdateCollegeInput!
    $condition: ModelCollegeConditionInput
  ) {
    updateCollege(input: $input, condition: $condition) {
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
export const deleteCollege = /* GraphQL */ `
  mutation DeleteCollege(
    $input: DeleteCollegeInput!
    $condition: ModelCollegeConditionInput
  ) {
    deleteCollege(input: $input, condition: $condition) {
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
export const createMajor = /* GraphQL */ `
  mutation CreateMajor(
    $input: CreateMajorInput!
    $condition: ModelMajorConditionInput
  ) {
    createMajor(input: $input, condition: $condition) {
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
export const updateMajor = /* GraphQL */ `
  mutation UpdateMajor(
    $input: UpdateMajorInput!
    $condition: ModelMajorConditionInput
  ) {
    updateMajor(input: $input, condition: $condition) {
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
export const deleteMajor = /* GraphQL */ `
  mutation DeleteMajor(
    $input: DeleteMajorInput!
    $condition: ModelMajorConditionInput
  ) {
    deleteMajor(input: $input, condition: $condition) {
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
export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createArticulationInformation = /* GraphQL */ `
  mutation CreateArticulationInformation(
    $input: CreateArticulationInformationInput!
    $condition: ModelArticulationInformationConditionInput
  ) {
    createArticulationInformation(input: $input, condition: $condition) {
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
export const updateArticulationInformation = /* GraphQL */ `
  mutation UpdateArticulationInformation(
    $input: UpdateArticulationInformationInput!
    $condition: ModelArticulationInformationConditionInput
  ) {
    updateArticulationInformation(input: $input, condition: $condition) {
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
export const deleteArticulationInformation = /* GraphQL */ `
  mutation DeleteArticulationInformation(
    $input: DeleteArticulationInformationInput!
    $condition: ModelArticulationInformationConditionInput
  ) {
    deleteArticulationInformation(input: $input, condition: $condition) {
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
export const createTransferCourse = /* GraphQL */ `
  mutation CreateTransferCourse(
    $input: CreateTransferCourseInput!
    $condition: ModelTransferCourseConditionInput
  ) {
    createTransferCourse(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
export const updateTransferCourse = /* GraphQL */ `
  mutation UpdateTransferCourse(
    $input: UpdateTransferCourseInput!
    $condition: ModelTransferCourseConditionInput
  ) {
    updateTransferCourse(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
export const deleteTransferCourse = /* GraphQL */ `
  mutation DeleteTransferCourse(
    $input: DeleteTransferCourseInput!
    $condition: ModelTransferCourseConditionInput
  ) {
    deleteTransferCourse(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
