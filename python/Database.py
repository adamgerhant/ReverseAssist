import requests
import json
import os
import time
# establish a session with requests session
session = requests.Session()

# As found in AWS Appsync under Settings for your endpoint.
APPSYNC_API_ENDPOINT_URL = 'http://192.168.56.1:20002/graphql'

def make_request(query, variables=None):
    data = {'query': query}
    if variables:
        data['variables'] = variables

    return session.request(
        url=APPSYNC_API_ENDPOINT_URL,
        method='POST',
        headers={'x-api-key': 'da2-fakeApiId123456'},
        json=data
    ).json()
    
def get_coordinates(collegeName):
    
    #REMOVE API KEY IF PUBLISHING CODE
    GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json?address="+collegeName+", CA&key=[API_KEY]"

    response = session.request(
        url= GEOCODING_URL,
        method='GET'
    ).json()
    print(json.dumps(response, indent=4))

    location = response["results"][0]["geometry"]["location"]
    return location

def get_all_coordinates():
    with open(f"src/data/schoolNameToID.json", 'r') as file:
        data = json.load(file)
    
    idToLocation = {}
    for collegeName, college_id in data.items():
        location = get_coordinates(collegeName)
        idToLocation[college_id] = location

    os.makedirs(os.path.dirname(f"python/colleges/locations.json"), exist_ok=True)
    with open("python/colleges/locations.json", 'w') as f:
        json.dump(idToLocation, f, indent=4)

def print_coordinates():
    with open("python/colleges/locations.json", 'r') as file:
        locationData = json.load(file)

    with open("src/data/schoolNameToID.json", 'r') as file:
        data = json.load(file)

    collegeNames = data.keys()
    for collegeName in collegeNames:
        collegeID_str = str(data[collegeName]) 
        print(collegeName)
        print(f"{locationData[collegeID_str]['lat']}, {locationData[collegeID_str]['lng']}")
        print("\n")

def add_college(college_id, collegeName, location):

    mutation = """
            mutation MyMutation($collegeName: String!, $collegeId: Int!, $latitude: Float!, $longitude: Float!) {
                createCollege(input: {collegeName: $collegeName, collegeId: $collegeId, latitude: $latitude, longitude: $longitude}) {
                    collegeName
                    collegeId
                    latitude
                    longitude
                }
            }
        """
    variables = {
        "collegeName": collegeName,
        "collegeId": int(college_id),
        "latitude":location["lat"],
        "longitude":location["lng"],
    }
    make_request(mutation, variables)

def add_colleges():
    with open(f"src/data/schoolNameToID.json", 'r') as file:
        data = json.load(file)

    with open("python/colleges/locations.json", 'r') as file:
        locationData = json.load(file)

    for collegeName, college_id in data.items():
        add_college(college_id, collegeName, locationData[str(college_id)])

def get_college_id(college_id):
    query = """
        query MyQuery($college_id: Int!) {
            listColleges(filter: {collegeId: {eq: $college_id}}) {
                items {
                    id
                }
            }
        }
    """
    variables = {
        "college_id":college_id
    }
    response = make_request(query, variables)
    if(len(response["data"]["listColleges"]["items"])>0):
        return response["data"]["listColleges"]["items"][0]["id"]
    return False

def major_exists(collegeModelId, major_name):
    query = """
            query MyQuery($collegeModelId: ID!, $major_name: String!) {
                getCollege(id: $collegeModelId) {
                    majors(filter: {name: {eq: $major_name}}) {
                        items {
                            id
                        }
                    }
    
                }
            }
        """
    variables = {
        "collegeModelId": collegeModelId,
        "major_name": major_name,
    }

    response = make_request(query, variables)

    allMajors = response["data"]["getCollege"]["majors"]
    if(allMajors == None or len(allMajors["items"])==0):
        return False
    return allMajors["items"][0]["id"]   
def course_exists(majorModelId, course_name):
    query = """
            query MyQuery($majorModelId: ID!, $course_name: String!) {
                getMajor(id: $majorModelId) {
                    courseArr(filter: {name: {eq: $course_name}}) {
                        items {
                            name
                            id
                        }
                    }
    
                }
            }
        """
    variables = {
        "majorModelId": majorModelId,
        "course_name": course_name,
    }

    response = make_request(query, variables)
    allCourses = response["data"]["getMajor"]["courseArr"]
    if(allCourses==None or len(allCourses["items"])==0):
        return False
    return allCourses["items"][0]["id"]
    
def delete_articulation_information(deleteId):
    query = """
            mutation MyQuery($id: ID!) {
                deleteArticulationInformation(input: {id: $id}){
                    courseArticulatedCollegesId
                    college
                    assistKey
                    id
                }
            }
        """
    variables = {
        "id": deleteId,
    }
    response = make_request(query, variables)
    print(response)

def articulation_information_exists(courseModelId, assistKey):
    query = """
            query MyQuery($courseModelId: ID!, $assistKey: Int!) {
                getCourse(id: $courseModelId) {
                    articulatedColleges(filter: {assistKey: {eq: $assistKey}}, limit:200) {
                        items {
                            id
                        }
                    }
    
                }
            }
        """
    variables = {
        "courseModelId": courseModelId,
        "assistKey": assistKey,
    }

    response = make_request(query, variables)

    allArticulationInformation = response["data"]["getCourse"]["articulatedColleges"]
    if(allArticulationInformation == None or len(allArticulationInformation["items"])==0):
        return False
    for index in range(1, len(allArticulationInformation["items"])):
        print("deleting articulation information: "+allArticulationInformation["items"][index]["id"])
        
        delete_articulation_information(allArticulationInformation["items"][index]["id"])
    
    return allArticulationInformation["items"][0]["id"]

def transfer_course_exists(articulationInformationId, transferCourse):
    query = """
            query MyQuery($articulationInformationId: ID!, $transferCourse: String!) {
                getArticulationInformation(id: $articulationInformationId) {
                    transferCourses(filter: {name: {eq: $transferCourse}}) {
                        items {
                            id
                        }
                    }
    
                }
            }
        """
    variables = {
        "articulationInformationId": articulationInformationId,
        "transferCourse": transferCourse,
    }

    response = make_request(query, variables)

    allTransferCourses = response["data"]["getArticulationInformation"]["transferCourses"]
    if(allTransferCourses==None or len(allTransferCourses["items"])==0):
        return False
    
    return allTransferCourses["items"][0]["id"]

def add_major(collegeModelId, major):
    majorId = major_exists(collegeModelId, major["name"])
    if(majorId == False):
        query = """
            mutation MyMutation($name: String!, $collegeMajorsId: ID!) {
                createMajor(input: {name: $name, collegeMajorsId: $collegeMajorsId}) {
                    collegeMajorsId
                    name
                    id
                }
            }
        """
        variables = {
            "name" : major["name"],
            "collegeMajorsId": collegeModelId
        }

        response = make_request(query, variables)


        majorId = response["data"]["createMajor"]["id"]

    
    for course in major["courses"]:
        courseId = course_exists(majorId, course["name"])
        print("courseID: "+courseId)
        if(courseId == False):

            query = """
                mutation MyMutation($name: String!, $majorCourseArrId: ID!) {
                    createCourse(input: {name: $name, majorCourseArrId: $majorCourseArrId}) {
                        majorCourseArrId
                        name
                        id
                    }
                }
            """
            variables = {
                "name" : course["name"],
                "majorCourseArrId": majorId
            }
            
            response = make_request(query, variables)

            courseId = response["data"]["createCourse"]["id"]

        for articulationInformation in course["articulatedColleges"]:
            articulationInformationId = articulation_information_exists(courseId, articulationInformation["assistKey"])
            #if(course["name"]=="CHEM 3B - Chemical Structure and Reactivity (3.00)"):
                #print("Articulation: "+str(articulationInformation["college"])+" exists: "+str(articulationInformationId))

            if(articulationInformationId==False):
                query = """
                    mutation MyMutation($college: Int!, $assistKey: Int!, $courseArticulatedCollegesId: ID!) {
                        createArticulationInformation(input: {college: $college, assistKey: $assistKey, courseArticulatedCollegesId: $courseArticulatedCollegesId}) {
                            courseArticulatedCollegesId
                            college
                            assistKey
                            id
                        }
                    }
                """
                variables = {
                    "college" : articulationInformation["college"],
                    "assistKey" : articulationInformation["assistKey"],
                    "courseArticulatedCollegesId": courseId
                }
                

                response = make_request(query, variables)
                articulationInformationId = response["data"]["createArticulationInformation"]["id"]
                #if(course["name"]=="CHEM 3B - Chemical Structure and Reactivity (3.00)"):
                    #print(f"Adding articulation information: "+str(articulationInformation["college"]))
                    #print(f"CourseId: "+str(courseId))
                    #print("articulationInformationId: "+articulationInformationId)
                    #if(articulationInformation["college"]==101):
                        #print(response)
            for transferCourse in articulationInformation["transferCourses"]:
                if(not transfer_course_exists(articulationInformationId, transferCourse)):
                    query = """
                        mutation MyMutation($name: String!, $articulationInformationTransferCoursesId: ID!) {
                            createTransferCourse(input: {name: $name, articulationInformationTransferCoursesId: $articulationInformationTransferCoursesId}) {
                                articulationInformationTransferCoursesId
                                name
                                id
                            }
                        }
                    """
                    variables = {
                        "name" : transferCourse,
                        "articulationInformationTransferCoursesId": articulationInformationId
                    }
                    response = make_request(query, variables)

def add_majors(college_id):
    with open(f"python/colleges/{college_id}/coursedata.json", 'r') as file:
        data = json.load(file)

    collegeModelId = get_college_id(college_id)
    if(not collegeModelId):
        print("college does not exist")
        return

    for major in data:
        add_major(collegeModelId, major)



    
majorName = "English, Lower Division B.A."
courseName = "ENGLISH 17 - Shakespeare (4.00)"
#print_coordinates()
#get_coordinates("California Maritime Academy")
#print(course_exists(79, courseName))
#add_colleges()
#add_majors(79)
