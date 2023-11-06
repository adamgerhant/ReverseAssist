import {AiFillCaretLeft} from 'react-icons/ai'
import {ReactComponent as ReversedDiagram} from './pictures/ReversedDiagram.svg'

const About = () =>{
    return(
        <div className='flex flex-col items-center'>
            <div className='bg-fuchsia-800 w-full flex flex-row'>
                <a href="/" className='flex row-row items-center ml-4'>
                    <AiFillCaretLeft className='text-white w-[20px] h-[20px]'/>
                    <p className='text-white text-xl font-semibold ml-1 mb-1'>Back</p>
                </a>
                <div className='text-4xl text-white font-semibold ml-[43%] mt-3 mb-4'>
                    About
                </div>
            </div>
            <div className='w-[700px] text-gray-800 mt-8'>
                The goal of this webapp is to reverse the directionality of Assist.org for finding articulated transfer courses. 
                With Assist, you select a source college, transfer college, and a major to view a document containing articulated courses.
                Reverse Assist reverses that process by allowing the user to select a transfer college, major, and articulated course, then view all source colleges with that course.
                For example, instead of searching through dozens of documents to find a college with an articulated course, Reverse Assist directly provides the list of colleges.
                <ReversedDiagram className='ml-[0px] my-8 w-[730px]'/>
                Technical information and source code is available on Github:{"\n"}
                <a href="https://github.com/adamgerhant/reverseassist" target="_blank" rel="noopener noreferrer" className='text-[#0000EE]'>github.com/adamgerhant/reverseassist</a>

                {/*
                    The implementation for this can be broken down into 4 major steps
                    <ol className="ml-6" style={{ listStyleType: 'decimal'}} >
                        <li className='mt-4'>Get metadata: Download college IDs, majors, and PDF document ids. Jacobtbigham's documentation on the various Assist API endpoints to extract this information was extremely helpful for this step. Check out his project here: {"\n"}
                            <a href="https://github.com/jacobtbigham/ccc_transfers"className='mx-2 text-[#0000EE]'>github.com/jacobtbigham/ccc_transfers</a>
                            <a href="https://www.jacobtbigham.com/transfers"className='mx-2 text-[#0000EE]'>www.jacobtbigham.com/transfers</a>
                        </li>
                        <li className='mt-4'>Create Database: Create GraphQL schema, integrate Python with the GraphQL API</li>
                        <li className='mt-4'>Parse Data: Use metadata to get every PDF document (100,000+), and extract articulated courses from each PDF using a custom algorithim</li>
                        <li className='mt-4'>Upload Data: Use GraphQL mutations to upload reformated information to database</li>
                    </ol>
                */}
            </div>
        </div>
    )
}

export default About