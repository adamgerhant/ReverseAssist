/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCollege = /* GraphQL */ `
  query GetCollege($id: ID!) {
    getCollege(id: $id) {
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
export const listColleges = /* GraphQL */ `
  query ListColleges(
    $filter: ModelCollegeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listColleges(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        collegeId
        collegeName
        latitude
        longitude
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMajor = /* GraphQL */ `
  query GetMajor($id: ID!) {
    getMajor(id: $id) {
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
export const listMajors = /* GraphQL */ `
  query ListMajors(
    $filter: ModelMajorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMajors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        collegeMajorsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
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
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        majorCourseArrId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getArticulationInformation = /* GraphQL */ `
  query GetArticulationInformation($id: ID!) {
    getArticulationInformation(id: $id) {
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
export const listArticulationInformations = /* GraphQL */ `
  query ListArticulationInformations(
    $filter: ModelArticulationInformationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticulationInformations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        college
        assistKey
        createdAt
        updatedAt
        courseArticulatedCollegesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTransferCourse = /* GraphQL */ `
  query GetTransferCourse($id: ID!) {
    getTransferCourse(id: $id) {
      id
      name
      createdAt
      updatedAt
      articulationInformationTransferCoursesId
      __typename
    }
  }
`;
export const listTransferCourses = /* GraphQL */ `
  query ListTransferCourses(
    $filter: ModelTransferCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransferCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        articulationInformationTransferCoursesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
