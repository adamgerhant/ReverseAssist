
import time
import urllib.request
import json
import re
import sys
import math
import os
import pdfrw
from pdfminer.high_level import extract_text
import fitz  # PyMuPDF
import io
from Database import add_major, get_college_id
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
        
def getKeys():
    #request once user inputs from and to
    with urllib.request.urlopen(f'https://assist.org/api/agreements?receivingInstitutionId={7}&sendingInstitutionId={2}&academicYearId={73}&categoryCode=major') as url:
        data = json.loads(url.read().decode())
    print(data)


class PDFGrabber():
    def __init__(self, school_id, delay):
        self.school_id = school_id
        self.delay = delay
    
    def get_agreements(self):
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
    
    def get_majors(self):
        with open('src/data/selectableColleges.json', 'r') as file:
            data = json.load(file)
        
        for value in data.values():
            majors = []
            
            with urllib.request.urlopen(f'https://assist.org/api/agreements?receivingInstitutionId={value}&sendingInstitutionId={45}&academicYearId={73}&categoryCode=major') as url:
                data = json.loads(url.read().decode())
            data = data['reports']
            for report in list(data):
                majors.append(report["label"])
            os.makedirs(os.path.dirname(f"python/majors/{value}majors.json"), exist_ok=True)
            with open(f"python/majors/{value}majors.json", "w") as file:
                json.dump(majors, file, indent=4)

    def college_data(self):
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

    def get_keys_for_major(self):
        with open('src/data/schoolNameToID.json', 'r') as file:
            data = json.load(file)
        #with open('src/data/selectableColleges.json', 'r') as file:
            #data = json.load(file)
        collegeIDs = data.values()
        for id in collegeIDs:
            with urllib.request.urlopen(f'https://assist.org/api/agreements?receivingInstitutionId={self.school_id}&sendingInstitutionId={id}&academicYearId={73}&categoryCode=major') as url:
                data = json.loads(url.read().decode())

            os.makedirs(os.path.dirname(f"python/colleges/{self.school_id}/{id}keys.json"), exist_ok=True)
            with open(f"python/colleges/{self.school_id}/{id}keys.json", "w") as file:
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
        add_major(collegeModelId, Major)

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
        parse_courses_from_major(majorData)

    #--------------------main functions------------------#
    def parse_courses_from_major(self, majorData, threadName):
        collegeModelId = get_college_id(self.school_id)
        if(not collegeModelId):
            print("college does not exist")
            return
        for major in majorData:
            print("running: "+threadName+" major: "+major)

            start_time = time.time()

            with open('src/data/schoolNameToID.json', 'r') as file:
                schoolNameData = json.load(file)
            collegeData = schoolNameData.items()

            with open(f'python/colleges/{self.school_id}/coursedata.json', 'r') as courseFile:
                courseData = json.load(courseFile)

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

            add_major(collegeModelId, Major)
            end_time = time.time()

            print(f"{threadName}: Time to add major: {end_time - start_time}")

    
        #with open(f"python/colleges/{self.school_id}/courseData.json", "w") as file:
        #   json.dump(courseData, file, indent=4)


def parse_courses_all_majors_multithreaded():
    pdfOBJ = PDFGrabber(79, 0.5)

    def run_parse_courses_from_major(obj, majorData, threadName):
        obj.parse_courses_from_major(majorData, threadName)

    threads = []

    with open(f'python/majors/{79}majors.json', 'r') as majorFile:
        majorData = json.load(majorFile)

    numThreads = 5

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
            time.sleep(30) #increase time

        for thread in threads:
            thread.join()
    else:
        print("The arrays are different")

pdfOBJ = PDFGrabber(79, 0.5)
#pdfOBJ.parse_courses_from_major(["Electrical Engineering & Computer Sciences, Lower Division B.S."], "thread 0")
#pdfOBJ.save_documents_for_major("Electrical Engineering & Computer Sciences, Lower Division B.S.")
pdfOBJ.parse_courses_for_major_from_file("American Studies, Lower Division B.A.")
