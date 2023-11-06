
import time
import urllib.request
import json
import re
import sys
import math
import os
import fitz  #pip install PyMuPDF
import io
from Database import add_major, get_college_id, major_exists
from PDFExtractor import PDFExtractor
import threading


def schoolNameToID():
    with open("institutions.json", "r") as f: 
        arr = json.load(f)  
    retJSON = {}
    for schoolOBJ in arr:
        if schoolOBJ["names"][0]["hideInList"] == False :
            retJSON[schoolOBJ["names"][0]["name"]] = schoolOBJ["id"]

    with open('schoolNameToID.json', 'w') as f:
        json.dump(retJSON, f)
        
def get_agreements():
    with urllib.request.urlopen(f'https://assist.org/api/institutions/{self.school_id}/agreements') as url:
        data = json.loads(url.read().decode())
    agreement_list = []
    
    for agreement in data:
        if len(agreement['sendingYearIds'])>0:
            
            school_id = agreement['institutionParentId']
            year = agreement['sendingYearIds'][-1]
            curr = {'id': school_id, 'year': year}
            exists = False
            for previousAgreement in agreement_list:
                if(previousAgreement["id"]==school_id):
                    exists = True
                
            if(exists==False):
                agreement_list.append(curr)
    return agreement_list

def get_majors():
    with open('src/data/selectableColleges.json', 'r') as file:
        data = json.load(file)
    
    for value in data.values():
        print(value)
        majors = []
        
        with urllib.request.urlopen(f'https://assist.org/api/agreements?receivingInstitutionId={value}&sendingInstitutionId={45}&academicYearId={73}&categoryCode=major') as url:
            data = json.loads(url.read().decode())
        data = data['reports']
        for report in list(data):
            majors.append(report["label"])
        os.makedirs(os.path.dirname(f"python/majors/{value}majors.json"), exist_ok=True)
        with open(f"python/majors/{value}majors.json", "w") as file:
            json.dump(majors, file, indent=4)

def college_data():
    with open('src/data/selectableColleges.json', 'r') as file:
        data = json.load(file)

    collegeArr = []
    for collegeName in data.keys():
        collegeId = data[collegeName]
        with open(f"python/majors/{collegeId}majors.json", 'r') as file:
            majorList = json.load(file)
        collegeArr.append({"collegeId": collegeId, "collegeName": collegeName, "majors":majorList})

    with open(f"python/collegeData.json", "w") as file:
        json.dump(collegeArr, file, indent=4)

class PDFGrabber():
    def __init__(self, school_id, delay):
        self.school_id = school_id
        self.delay = delay
    
    

    def get_keys_for_university(self):
        with open('src/data/schoolNameToID.json', 'r') as file:
            data = json.load(file)
        #with open('src/data/selectableColleges.json', 'r') as file:
            #data = json.load(file)
        collegeIDs = data.values()
        for id in collegeIDs:
            with urllib.request.urlopen(f'https://assist.org/api/agreements?receivingInstitutionId={self.school_id}&sendingInstitutionId={id}&academicYearId={73}&categoryCode=major') as url:
                data = json.loads(url.read().decode())

            os.makedirs(os.path.dirname(f"python/colleges/{self.school_id}/keys/{id}keys.json"), exist_ok=True)
            with open(f"python/colleges/{self.school_id}/keys/{id}keys.json", "w") as file:
                json.dump(data, file, indent=4)

    def save_documents_for_major(self, major):
        with open('src/data/schoolNameToID.json', 'r') as file:
            data = json.load(file)
        collegeIDs = data.values()
        for collegeID in collegeIDs:
            with open(f'python/colleges/{self.school_id}/keys/{collegeID}keys.json', 'r') as keyFile:
                keyData = json.load(keyFile)
                reports = keyData["reports"]
                keyOBJArr = [obj for obj in reports if obj.get('label') == major]
                if(len(keyOBJArr)>0):
                    key = keyOBJArr[0]["key"]
                    pdf_url = f'https://assist.org/api/artifacts/{key}'
                    file_name = f'python/colleges/{self.school_id}/documents/{collegeID}/{key}.pdf'
                    os.makedirs(os.path.dirname(file_name), exist_ok=True)
                    with open(file_name, 'wb') as f:
                        f.write(urllib.request.urlopen(pdf_url).read())
                    time.sleep(self.delay)

    def get_document_for_major(self, major, collegeID):
        
        with open(f'python/colleges/{self.school_id}/keys/{collegeID}keys.json', 'r') as keyFile:
            keyData = json.load(keyFile)
            reports = keyData["reports"]
            keyOBJArr = [obj for obj in reports if obj.get('label') == major]
            if(len(keyOBJArr)>0):
                key = keyOBJArr[0]["key"]
                pdf_url = f'https://assist.org/api/artifacts/{key}'
                pdf_buffer = urllib.request.urlopen(pdf_url).read()
                stream = io.BytesIO(pdf_buffer)
                return(stream)

    def parse_courses_for_major_from_file(self, major):
        collegeModelId = get_college_id(self.school_id)
        if(not collegeModelId):
            print("college does not exist")
            return
        with open('src/data/schoolNameToID.json', 'r') as file:
            data = json.load(file)
        collegeIDs = data.values()

        with open(f'python/colleges/{self.school_id}/coursedata.json', 'r') as courseFile:
            courseData = json.load(courseFile)

        courseArr = []
        
        for collegeID in collegeIDs:
            with open(f'python/colleges/{self.school_id}/keys/{collegeID}keys.json', 'r') as keyFile:
                keyData = json.load(keyFile)
                reports = keyData["reports"]
                keyOBJArr = [obj for obj in reports if obj.get('label') == major]
                if(len(keyOBJArr)>0):
                    key = keyOBJArr[0]["key"]

                    file_name = f'python/colleges/{self.school_id}/documents/{collegeID}/{key}.pdf'
                    
                    pdfOBJ = PDFExtractor(file_name=file_name, pdf_stream="")
                    courses = pdfOBJ.dict_from_file()
                    
                    for course in courses:

                        articulationInformation = {"college":collegeID, "assistKey":key, "transferCourses": course["transferCourses"]}
                            
                        courseFromMajor = [courseOBJ for courseOBJ in courseArr if courseOBJ.get('name') == course["courseName"]]

                        if(len(courseFromMajor)==0):
                            Course = {"name": course["courseName"], "articulatedColleges": [articulationInformation]}
                            courseArr.append(Course)
                        else:
                            Course = courseFromMajor[0]
                            Course["articulatedColleges"].append(articulationInformation)
                        
        Major = {"name": major, "courses": courseArr}
        add_major(collegeModelId, Major, True)

        #index = -1              
        #for i, obj in enumerate(courseData):
        #   if obj["name"] == major:
        #        index = i
        #if index == -1:
        #    courseData.append(Major)
        #else:
        #    courseData[index]["courses"] = courseArr
    

        #with open(f"python/colleges/{self.school_id}/courseData.json", "w") as file:
        #    json.dump(courseData, file, indent=4)
    
    def parse_courses_all_majors(self):
        print("parsing courses for all majors")
        with open(f'python/majors/{self.school_id}majors.json', 'r') as majorFile:
            majorData = json.load(majorFile)
        self.parse_courses_from_major(majorData, "Thread0", True)

    #--------------------main function------------------#
    def parse_courses_from_major(self, majorData, threadName, checkIfExists):
        collegeModelId = get_college_id(self.school_id)
        
        if(not collegeModelId):
            print("college does not exist")
            return
        for major in majorData:
            if(major_exists(collegeModelId, major)):
                pass#print("already added: "+major)
            else:
                print("missing major: "+major)
            if(False):
            
                print("running: "+threadName+" major: "+major)
                start_time = time.time()

                with open('src/data/schoolNameToID.json', 'r') as file:
                    schoolNameData = json.load(file)
                collegeData = schoolNameData.items()

                #with open(f'python/colleges/{self.school_id}/coursedata.json', 'r') as courseFile:
                    #courseData = json.load(courseFile)

                courseArr = []
                
                for collegeName, collegeID in collegeData:
                    with open(f'python/colleges/{self.school_id}/keys/{collegeID}keys.json', 'r') as keyFile:
                        keyData = json.load(keyFile)
                        reports = keyData["reports"]
                        keyOBJArr = [obj for obj in reports if obj.get('label') == major]
                        if(len(keyOBJArr)>0):
                            key = keyOBJArr[0]["key"]

                            #file_name = f'python/colleges/{self.school_id}/documents/{collegeID}/{key}.pdf'
                            #print(f"{threadName}: making request to: "+str(collegeName))
                            
                            pdf_stream = self.get_document_for_major(major, collegeID)
                            pdfOBJ = PDFExtractor(file_name="", pdf_stream=pdf_stream)
                            courses = pdfOBJ.dict_from_pdf()
                            for course in courses:

                                articulationInformation = {"college":collegeID, "assistKey":key, "transferCourses": course["transferCourses"]}
                                    
                                courseFromMajor = [courseOBJ for courseOBJ in courseArr if courseOBJ.get('name') == course["courseName"]]
                                
                                if(len(courseFromMajor)==0):
                                    Course = {"name": course["courseName"], "articulatedColleges": [articulationInformation]}
                                    courseArr.append(Course)
                                else:
                                    Course = courseFromMajor[0]
                                    Course["articulatedColleges"].append(articulationInformation)
                                
                Major = {"name": major, "courses": courseArr}
                print(f"{threadName}: Adding major: "+str(major))

                add_major(collegeModelId, Major, checkIfExists)
                end_time = time.time()

                print(f"{threadName}: Time to add major: {end_time - start_time}")

    
        #with open(f"python/colleges/{self.school_id}/courseData.json", "w") as file:
        #   json.dump(courseData, file, indent=4)


def parse_courses_all_majors_multithreaded(collegeId, checkIfExists):
    pdfOBJ = PDFGrabber(collegeId, 0.5)

    def run_parse_courses_from_major(obj, majorData, threadName):
        obj.parse_courses_from_major(majorData, threadName, checkIfExists)

    threads = []

    with open(f'python/majors/{collegeId}majors.json', 'r') as majorFile:
        majorData = json.load(majorFile)

    numThreads = 25

    groupedMajorData = []
    extendedMajorData = []
    for i in range(numThreads):
        majors_size = len(majorData)
        chunk_size = math.ceil(majors_size / numThreads)
        start_index = chunk_size * i
        end_index = min(chunk_size * (i + 1), majors_size)
        threadArr = majorData[start_index:end_index] 
        extendedMajorData.extend(threadArr)
        groupedMajorData.append(threadArr)

    if majorData == extendedMajorData:
        print("The arrays are the same")
        for i in range(numThreads):
            arrayForThread = groupedMajorData[i]
            thread = threading.Thread(target=run_parse_courses_from_major, args=(pdfOBJ, arrayForThread, "Thread "+str(i)))
            thread.start()
            #time.sleep(30)

        for thread in threads:
            thread.join()
    else:
        print("The arrays are different")

#bugged at: 
# (UCSD)
# Public Health with Concentration in Biostatistics B.S. 
# PSYC 2 - General Psychology: Biological Foundations (4.00)

# Psychology B.S. with a Specialization in Human Health
# PHYS 2B - Physics - Electricity and Magnetism (4.00)

# International Studies - Sociology  B.A.


#step 1: get majors for all UCs
#get_majors()

#step 2: get kesys for all UCs
#pdfOBJ = PDFGrabber(7, 0.5)
#pdfOBJ.get_keys_for_university()

#step 3: parse courses from assist and add to database
#params: schoolId, checkIfExists: checks if item to add already exists if set to True. Safer but 2-3x slower.
parse_courses_all_majors_multithreaded(144, True)

#UC ids
#{"University of California, Berkeley": 79,
#"University of California, Irvine": 120, 
#"University of California, Davis": 89,
#"University of California, Los Angeles": 117, 
#"University of California, Riverside": 46, 
#"University of California, San Diego": 7, 
#"University of California, Santa Barbara": 128, 
#"University of California, Santa Cruz": 132, 
#"University of California, Merced": 144
#}

#other function examples:
#pdfOBJ = PDFGrabber(120, 0.5)
#pdfOBJ.parse_courses_from_major(["Environmental Engineering, B.S."], "thread 0", True)
#pdfOBJ.save_documents_for_major("Electrical Engineering & Computer Sciences, Lower Division B.S.")
#pdfOBJ.parse_courses_for_major_from_file("American Studies, Lower Division B.A.")
