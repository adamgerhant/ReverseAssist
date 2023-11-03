import time
import urllib.request
import json
import re
import sys
import math
import os
import fitz  #pip install PyMuPDF
import io

class PDFExtractor:

    def __init__(self, file_name, pdf_stream):
        self.file_name = file_name
        self.num_pages = 0
        self.pdf_stream = pdf_stream

    def dict_from_file(self):
        with open(self.file_name, 'rb') as file:
            pdf_buffer = file.read()
            self.pdf_stream = pdf_buffer

        return self.dict_from_pdf()
     
    def dict_from_pdf(self):

        pdf_document = fitz.open(stream=self.pdf_stream, filetype="pdf")

        doc = fitz.open()  # empty output PDF

        width, height = pdf_document[0].rect.width, pdf_document[0].rect.height

        r = fitz.Rect(0, 0, width, height)

        # now copy input pages to output
        page = doc.new_page(-1, width = width, height = height*pdf_document.page_count)
        page_number = 0
        for spage in pdf_document:
            # insert input page into the correct rectangle
            page.show_pdf_page(r+(0, r.height*page_number, 0, r.height*page_number),  # select output rect
                            pdf_document,  # input document
                            spage.number)  # input page number
            page_number+=1

        #search_rect = fitz.Rect(280, 779, 475, 800)  # Define the rectangle area

        #text = page.get_text("text", clip=search_rect)

        arrow_instances = page.search_for("←")
        end_of_agreement = page.search_for("END OF AGREEMENT")
        courseData = []
        for i in range(0, len(arrow_instances)):

            arrow_rect = arrow_instances[i]
            if(i==len(arrow_instances)-1):
                next_arrow_rect = end_of_agreement[0]
            else:
                next_arrow_rect = arrow_instances[i+1]

            page.add_redact_annot(arrow_rect, fill=(1, 0, 0))

            left_rect = fitz.Rect(0, arrow_rect.y0+5, 280, next_arrow_rect.y0+5)
            left_text = page.get_text("dict", clip=left_rect)

            page.add_redact_annot(left_rect, fill=(1, 0, 0))
            for line in left_text["blocks"][0]["lines"]:
                for i in range(len(line["spans"])):
                    span = line["spans"][i]
                    courseName = span["text"]
                    courseName = courseName.replace('\u200b', '')

                    if(span["font"]=="SegoeUIBold" and any(char.isdigit() for char in courseName)):
                        courseDescription = ""
                        if(i<len(line["spans"])-1):
                            if(line["spans"][i+1]["font"]=="SegoeUIRegular"):
                                courseDescription = line["spans"][i+1]["text"]
                                courseDescription = courseDescription.replace('\u200b', '')
                        
                        
                        right_rect = fitz.Rect(310, arrow_rect.y0+3, width, next_arrow_rect.y0+5)
                        page.add_redact_annot(right_rect, fill=(1, 0, 0))
                        right_dict = page.get_text("dict", clip=right_rect)
                        transferCourses = []
                        for block in right_dict["blocks"]:
                            for right_line in block["lines"]:
                                for i in range(len(right_line["spans"])):
                                    right_span = right_line["spans"][i]
                                    right_text = right_span["text"].replace('\u200b', '')
                                    if(right_span["font"]=="SegoeUIBold" and any(char.isdigit() for char in right_text)):
                                        transferCourseName = right_text
                                        transferCourseDescription = ""
                                        if(i<len(line["spans"])-1):
                                            if(line["spans"][i+1]["font"]=="SegoeUIRegular"):
                                                transferCourseDescription = line["spans"][i+1]["text"]
                                                transferCourseDescription = transferCourseDescription.replace('\u200b', '')
                                        fullTransferCourseName = transferCourseName+transferCourseDescription
                                        transferCourses.append(transferCourseName)
                        fullCourseName = courseName + courseDescription
                        course = {"courseName": fullCourseName, "transferCourses":transferCourses}
                        courseData.append(course)
                        

            #print(json.dumps(left_text, indent=4))

            #course = left_text.split("-", 1)[0]
            #courses.append(course)

        #print(courses)
        
        #output_pdf_path = 'merged_long_page.pdf'
        #doc.save(output_pdf_path)
        return courseData