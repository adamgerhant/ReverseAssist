
## Reverse Assist helps students find nearby colleges with articulated courses for UC transfer.
https://www.reverseassist.com

![ReverseAssist](https://github.com/adamgerhant/ReverseAssist/assets/116332429/c50ea9ac-c44f-4e10-bb14-8c7474ae7f89)

# Technical Details:

Backend: AWS DynamoDB with GraphQL API.

Database generation: Python scripts to parse API data, get courses from PDFs, and upload by making requests to GraphQL API.

Frontend: React+Tailwind

# Database Generation
Generating the Database was the most challenging and time consuming part. Over 100,000 PDFs have been parsed into roughly 1 million courses across roughly 1 thousand majors. The general process can be broken down into 4 steps.
<ul>
<li>Get metadata: Download college IDs, majors, and PDF document ids. Jacobtbigham's documentation on the various Assist API endpoints to extract this information was extremely helpful for this step. Check out his project here: www.github.com/jacobtbigham/ccc_transfers, www.jacobtbigham.com/transfers</li>
  
<li>Create Database: Create GraphQL schema, integrate Python with the GraphQL API</li>
<li>Parse Data: Use metadata to get every PDF document, and extract articulated courses from each PDF using a custom algorithim</li>
<li>Upload Data: Use GraphQL mutations to upload reformated information to database</li>
</ul>
