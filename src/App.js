
import { API, graphqlOperation } from 'aws-amplify';
import { getArticulationInformation, getCollege, listColleges } from './graphql/queries';
import { createCollege, createMajor, deleteCollege } from './graphql/mutations';
import { useEffect, useRef, useState } from 'react';
import schoolNamesJSON from "./data/schoolNameToID.json"
import selectableColleges from './data/selectableColleges.json'
import collegeJSON from './data/collegeData.json'
import { Select, MenuItem, Autocomplete, TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {FaLinkedin} from 'react-icons/fa'
import {BsGithub, BsChevronDown, BsChevronUp} from 'react-icons/bs'
import {HiOutlineExternalLink} from 'react-icons/hi'
import {FiMail} from 'react-icons/fi'
import {RxCross2} from 'react-icons/rx'

import allLocations from './data/locations.json'
import { GoogleMap, LoadScript, Marker,  InfoWindow} from '@react-google-maps/api';

const MapMarker = ({openedCollege, setOpenedCollege, collegePosition, articulationInformation, currentCoordinates, targetCollege, major, course})=>{
  return(
  <>
      <Marker 
        onClick={()=>{setOpenedCollege(articulationInformation.college)}}
        position={collegePosition}         
      />
      {openedCollege==articulationInformation.college&&
        
        <InfoWindow position={collegePosition} 
          options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
          onCloseClick={()=>{setOpenedCollege()}}
          onMouseLeave={()=>{setOpenedCollege()}}
        >
          <div className='text-[15px]'>
            <h3 className='text-[20px]'>{articulationInformation.collegeName}</h3>
            <p className=''>Distance: {currentCoordinates.lat&&(articulationInformation.distance+" mi") || "disabled"}</p>
            <p className=' mt-2'>To: {targetCollege}</p>
            <p className=' mt-1 w-[280px]'>Major: {major}</p>
            <p className=' mt-1 w-[280px]'>Course: {course}</p>

            <div className='flex flex-row items-center  mt-2'>
              Assist link: 
              <a href={"https://assist.org/transfer/report/"+articulationInformation.assistKey} className={"ml-1  w-[115px] h-[22px] underline text-[#0000EE] flex flex-row items-center"} target="_blank" rel="noopener noreferrer">
                Assist Report
                <HiOutlineExternalLink className="ml-1 w-[15px] h-[15px] text-[#0000EE]"/>
              </a> 
            </div>
                     
            <div className='flex flex-row mt-1'>
              <p className='' >Courses:</p>
              <div className='flex flex-col'>
                {articulationInformation.transferCourses.items.map((transferCourse, i)=>(
                  <p className='font-semibold text-gray-800  ml-2' key={i}>
                    {transferCourse.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </InfoWindow>
      }
    </>
  )
}

const ArticulationCard = ({articulationInformation, currentCoordinates, getLocation}) =>{
  return(
    <div  className='flex flex-row w-[625px] border rounded my-2 px-2 py-2 '>
      <div className='w-[255px] px-2'>{articulationInformation.collegeName}</div>
      <a href={"https://assist.org/transfer/report/"+articulationInformation.assistKey} className={"w-[115px] h-[22px] underline text-[#0000EE] flex flex-row items-center"} target="_blank" rel="noopener noreferrer">
        Assist Report
        <HiOutlineExternalLink className="w-[15px] h-[15px] ml-1 text-[#0000EE]"/>
      </a>
      <div className='flex flex-col w-[110px] ml-[auto] mr-4 '>
      {articulationInformation.transferCourses.items.map((transferCourse, i)=>(
        <div key={i} className='text-left font-semibold'>
          {transferCourse.name}
        </div>
      ))}
      </div>
      {currentCoordinates.lat&&<div className='w-[70px]'>
        {articulationInformation.distance} mi
      </div>}
      {!currentCoordinates.lat&&
        <div onClick={()=>getLocation()} className='w-[70px] cursor-pointer'>
        Disabled
       </div>}
    </div>
  )
}
function App() {
  const [colleges, setColleges] = useState([])
  const [majors, setMajors] = useState([])
  const [courses, setCourses] = useState([])
  const [articulatedColleges, setArticulatedColleges] = useState([])
  const [selectedCollege, setSelectedCollege] = useState()
  const [selectedMajorId, setSelectedMajorId] = useState()
  const [selectedCourseId, setSelectedCourseId] = useState()
  const [collegeNameFilter, setCollegeNameFilter] = useState("")
  const [gettingCourses, setGettingCourses] = useState(false)
  const [currentCoordinates, setLocation] = useState({ lat: null, lng: null });
  const [openedCollege, setOpenedCollege] = useState()
  const [center, setCenter] = useState({lat: 36.7378, lng: -119.7871})
  const [zoom, setZoom] = useState(6)
  const [showEmail, setShowEmail] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [tab, setTab] = useState("Table")
  const [selectExpanded, setSelectExpanded] = useState(false)
  //console.log("selected college id: "+selectedCollege)
  //console.log("selectedMajorId: "+selectedMajorId)
  //console.log("selected course Id: "+ selectedCourseId)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.screen.width < 768);
    };

    window.addEventListener('resize', checkScreenSize);

    checkScreenSize();
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const getLocation = () => {
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setZoom(10)
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(()=>{
    API.graphql(graphqlOperation(listColleges)).then(colleges=>{
      setColleges(colleges.data.listColleges.items || [])
    })
  },[])



  const matchSorter = (options, inputValueProp) => {
    const inputValue = inputValueProp.toLowerCase();
    const retArr = options.filter((element)=>{
      if(element.toLowerCase().includes(inputValue)){
        return element;     
      }
    })

    let ucArr= []

    if(inputValue=="uc"){
      ucArr = ["University of California, San Diego", 
        "University of California, Riverside", 
        "University of California, Berkeley",
        "University of California, Davis",
        "University of California, Los Angeles",
        "University of California, Irvine",
        "University of California, Santa Barbara",
        "University of California, Santa Cruz",
        "University of California, Merced"
      ]
    }
    else if(inputValue=="ucs"){
      ucArr = ["University of California, San Diego", "University of California, Santa Barbara", "University of California, Santa Cruz"]
    }
    else if(inputValue=="ucsd"){
      ucArr=["University of California, San Diego"]
    }
    else if(inputValue=="ucsb"){
      ucArr = ["University of California, Santa Barbara"]
    }
    else if(inputValue=="ucsc"){
      ucArr = ["University of California, Santa Cruz"]
    }
    else if(inputValue=="ucr"){
      ucArr = ["University of California, Riverside"]
    }
    else if(inputValue=="ucb"){
      ucArr=["University of California, Berkeley"]
    }
    else if(inputValue=="ucd"){
      ucArr=["University of California, Davis"]
    }
    else if(inputValue=="ucl"||inputValue=="ucla"){
      ucArr=["University of California, Los Angeles"]
    }
    else if(inputValue=="uci"){
      ucArr=["University of California, Irvine"]
    }
    else if(inputValue=="ucm"){
      ucArr=["University of California, Merced"]
    }
   
    retArr.push(...ucArr)
    return retArr

  }
  const filterOptions = (options, {inputValue}) => matchSorter(options, inputValue);

  

  function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in miles
    return Math.round(d);
  }

  function deg2rad(deg) {
      return deg * (Math.PI / 180);
  }

  const articulatedCollegesWithName = []
  const articulatedCollegesWithNameNoCourse = []

  articulatedColleges.forEach(articulationInformation=>{
    const collegeCoords = allLocations[articulationInformation.college]
    const distance = getDistanceFromLatLonInMiles(
      currentCoordinates.lat, currentCoordinates.lng, collegeCoords.lat, collegeCoords.lng
    ); 
    const collegeName = Object.keys(schoolNamesJSON).find(key => schoolNamesJSON[key] === articulationInformation.college);
    if(collegeName.toLowerCase().includes(collegeNameFilter.toLowerCase())){
      articulatedCollegesWithName.push({collegeName:collegeName, distance:distance, ...articulationInformation})
      if(articulationInformation.transferCourses.items.length==0){
        articulatedCollegesWithNameNoCourse.push({collegeName:collegeName, distance:distance, ...articulationInformation})
      }

    }
  })

  majors.sort((a, b)=>a.name>b.name ?1:-1)
  courses.sort((a, b)=>a.name>b.name ?1:-1)

  articulatedCollegesWithName.sort((a, b)=>a.distance>b.distance ?1:-1)
  articulatedCollegesWithNameNoCourse.sort((a, b)=>a.distance>b.distance ?1:-1)
  const mapRef = useRef()
  return (
    <div className={`flex flex-${isMobile?"col":"row"} h-[100vh] relative`}>
      {showEmail&&
            <div className='absolute z-10 left-[150px] top-[90px] bg-white border border-black px-4 py-2 rounded flex flex-row items-center'>
              adamgerhant@gmail.com
              <RxCross2 onClick={()=>setShowEmail(false)} className='cursor-pointer rounded-full ml-2 p-[1px] mt-[1px] w-[20px] h-[20px] hover:bg-gray-200 text-gray-800'> x</RxCross2>
            </div>}
      <div className={`flex flex-col ${isMobile?"pb-2":"w-[480px] h-[100%]"}  items-center bg-fuchsia-800`}>
          {!isMobile&&
          <>
            <p className='text-2xl text-white font-semibold mt-5'>Created by: Adam Gerhant</p>

            <div className='flex flex-row mt-2 items-center relative'>
              <a href="/about" className='text-xl text-white mx-3 cursor-pointer'>About</a>
              <p className='text-xl text-white mx-3 cursor-pointer'>Portfolio</p>
              <FaLinkedin className='w-[25px] h-[25px] white mx-3 cursor-pointer text-white'/>

              <a href="https://github.com/adamgerhant/ReverseAssist" target="_blank" rel="noopener noreferrer">
                <BsGithub  className='w-[25px] h-[25px] white mx-3 cursor-pointer text-white'/>
              </a>
              
              <FiMail onClick={()=>setShowEmail(!showEmail)} className='w-[25px] h-[25px] white mx-3 cursor-pointer text-white'/>
              
            </div>
            </>
          } 
          <p className={`text-${isMobile?"2xl":"6xl"}  ${isMobile?"":""} text-white font-semibold mt-${isMobile?1:6}`}>Reverse Assist</p>
          
          <div className={`flex flex-col ${isMobile?`w-[95%] min-w-[300px] mt-2 pt-2 pb-4 ${selectExpanded?"h-[250px]":"h-[80px]"}  overflow-scroll`:"w-[430px] mt-12 pt-8 pb-16"} rounded bg-white  items-center `}>
            <div className='flex flex-col w-[93%]'>
              <p className={isMobile?"text-[16px] text-[#555]":'text-xl mb-2'}>Select a university to view majors</p>
              <Autocomplete
                disablePortal
                
                options={Object.keys(selectableColleges)}
                size= {isMobile?"small":""}
                sx={{ width: isMobile?'full':390}}
                renderInput={(params) => <TextField {...params}/>}
                filterOptions={filterOptions}
                onChange={(e) => {
                  const selectedText = e.target.innerText;
                  setSelectedMajorId()
                  setSelectedCourseId()
                  setArticulatedColleges([])
                  setCourses([])
                  setMajors([])
                  if (selectedText) {
                    const selectedCollege = selectableColleges[selectedText];
                    setSelectedCollege(selectedCollege);
                    console.log("getting majors")
                    const getMajors = 
                    `query getMajors(
                        $collegeId: Int!
                      ){
                        listColleges(filter: { collegeId: { eq: $collegeId }}, limit: 150 ){
                          items{
                            majors(limit:200){
                              items{
                                id
                                name
                              }
                            }
                          }
                        }
                      }
                      `
                    API.graphql({
                      query: getMajors,
                      variables: {
                        collegeId: selectedCollege,
                      }
                    }).then(response=>{
                      console.log("received majors")
                      console.log(response)
                      setMajors(response.data.listColleges.items[0].majors.items)
                    })
                  }else{
                    setSelectedCollege()
                  }
                }}
              />
            </div>
            
            <div className='flex flex-col w-[93%]'>

              <p className={isMobile?"text-[16px] mt-2  text-[#555]":'text-xl mb-2'}>Select a major to view courses</p>
              <Autocomplete
                disablePortal
                disabled = {majors.length==0||!selectedCollege}
                options={majors}
                value = {majors.find(major=>major.id==selectedMajorId) || !selectedCollege&&{name:"First select a university"} || selectedCollege&&majors.length==0&&{name:"Getting majors..."} || selectedCollege&&majors.length>0&&{name:""}}
                getOptionLabel={(option) => option.name}
                size= {isMobile?"small":""}
                sx={{ width: isMobile?'full':390}}
                renderInput={(params) => <TextField {...params} />}
                onChange={(e) => {
                  
                  const selectedText = e.target.innerText;
                  setSelectedCourseId()
                  setArticulatedColleges([])
                  setCourses([])
                  if (selectedText) {
                    const selectedMajorId = majors.find(major=>major.name==selectedText).id;
                    setSelectedMajorId(selectedMajorId);
                    
                    const getCourses = 
                    `query getCourses(
                        $majorId: ID!
                      ){
                        getMajor(id: $majorId){
                          courseArr{
                            items{
                              id
                              name            
                            }
                          }        
                        }
                      }
                    `
                    API.graphql({
                      query: getCourses,
                      variables: {
                        majorId: selectedMajorId
                      }
                    }).then(response=>{
                      setCourses(response.data.getMajor.courseArr.items)
                    }
                    )
                  }
                  else{
                    setSelectedMajorId()
                  }
                  
                }}
              />
            </div>

            <div className='flex flex-col w-[93%]'>
              <p className={isMobile?"text-[16px] mt-2  text-[#555]":'text-xl mb-2'}>Select a course</p>
              <Autocomplete
                disablePortal={true}
                ListboxProps={
                  {
                    style:{
                        maxHeight: '300px',
                    }
                  }
                }                
                disabled = {courses.length==0||!selectedMajorId}
                options={courses}
                getOptionLabel={(option) => option.name}
                value = {courses.find(course=>course.id==selectedCourseId) || !selectedMajorId&&{name:"First select a major"} || selectedMajorId&&courses.length==0&&{name:"Getting courses..."} || selectedMajorId&&courses.length>0&&{name:""}}
                size= {isMobile?"small":""}
                sx={{ width: isMobile?'full':390}}
                renderInput={(params) => <TextField {...params}/>}
                onChange={(e) => {
                  const selectedText = e.target.innerText;
                  setArticulatedColleges([])

                  if (selectedText) {
                    setGettingCourses(true)
                    const selectedCourseId = courses.find(course=>course.name==selectedText).id;

                    setSelectedCourseId(selectedCourseId);
                    const getArticulatedColleges = 
                      `query getArticulatedColleges(
                          $courseId: ID!
                        ){
                          getCourse(id: $courseId){
                            articulatedColleges(limit: 250) {
                              items {
                                transferCourses {
                                  items {
                                    name
                                  }
                                }
                                college
                                assistKey
                                id
                              }
                            }    
                          }
                        }
                      `
                    API.graphql({
                      query: getArticulatedColleges,
                      variables: {
                        courseId: selectedCourseId
                      }
                    }).then(response=>{
                      setArticulatedColleges(response.data.getCourse.articulatedColleges.items)
                      setGettingCourses(false)
                    }
                    )
                  }
                  else{
                    setSelectedCourseId()
                  }
                  
                }}
              />
            </div>
          </div>
          {isMobile&&selectExpanded&&<div onClick={()=>setSelectExpanded(false)}className='flex flex-col items-center mb-1  text-[#444] font-semibold bg-[rgba(255,255,255,1)] w-[160px] border-t border-[#555] rounded-b'>
            <div className='flex flex-row'>
              <BsChevronUp className='mt-[4px] ml-2 h-[16px] w-[16px]'/>
            </div>
          </div>}
          {isMobile&&!selectExpanded&&<div onClick={()=>setSelectExpanded(true)}className='flex flex-col items-center mb-1  text-[#444] font-semibold bg-[rgba(255,255,255,1)] w-[160px] border-t border-[#555] rounded-b'>
            <div className='flex flex-row'>
              <BsChevronDown className='mt-[4px] mb-[2px] ml-2 h-[16px] w-[16px]'/>
            </div>
          </div>}
          {!isMobile&&
          <>
          <div className='text-lg w-[85%] text-white mt-[110px] font-semibold flex flex-row'>
            Reverse Assist is not affiliated with
            <a href="https://www.assist.org" target="_blank" rel="noopener noreferrer" className='text-white underline mx-[5px] cursor-pointer'>Assist.org</a> 

          </div>
            <div className='text-lg w-[85%] text-white font-semibold mt-[-2px] '>
            in any way. This is a tool I created to help students find colleges with articulated courses. 
          </div>
          </>}
      </div>
      {isMobile&&
        <div className='w-full flex flex-col items-center'>
          <ToggleButtonGroup
              color="primary"
              value={tab}
              exclusive
              onChange={(e)=>setTab(e.target.value)}
              aria-label="Platform"
            >
              <ToggleButton value="Table" sx={{width:150, height:35, marginTop:"10px"}}>Table</ToggleButton>
              <ToggleButton value="Map" sx={{width:150, height:35, marginTop:"10px"}}>Map</ToggleButton>
          </ToggleButtonGroup>
        </div>
      }
      
      {(!isMobile||tab=="Table")&&
        <div className={isMobile?"w-full overflow-scroll flex":""}>
          <div className={`flex flex-col ${isMobile?"mx-1":"mx-10"} items-center relative bg-white`}>
            <div className='flex flex-row items-center mt-5'>
                <div className='flex flex-row  w-[255px] text-lg font-semibold text-gray-800 '>
                
                  <TextField 
                    label="College Name"
                    value={collegeNameFilter}
                    onChange={(e)=>setCollegeNameFilter(e.target.value)}
                    size="small"
                    sx={{width:"250px", marginLeft:"-8px"}}
                  />
                  </div>
                
                <div className='w-[155px] text-lg font-semibold text-gray-800'>Assist link</div>
                <div className='w-[130px] text-lg font-semibold text-gray-800 pr-5'>Courses</div>
                <div className='w-[90px] text-lg font-semibold text-gray-800 pr-5'>Distance</div>

            </div>

            <div className=' w-[685px] flex flex-col  mt-2 mb-5 px-5 border rounded overflow-y-scroll h-[840px]'>
              
              {articulatedCollegesWithName.map((articulationInformation, i)=>{
                if(articulationInformation.transferCourses.items.length>0){
                  return(<ArticulationCard articulationInformation={articulationInformation} currentCoordinates={currentCoordinates} getLocation={getLocation}/>)
                }} 
              )}

              {articulatedCollegesWithNameNoCourse.map((articulationInformation, i)=>
                <ArticulationCard articulationInformation={articulationInformation} currentCoordinates={currentCoordinates} getLocation={getLocation}/>
              )}
              {!gettingCourses&&articulatedColleges.length==0&&
                <div className=' h-[100vh] flex justify-center items-center text-2xl font-semibold text-gray-800'>
                  No course selected
                </div>}
              {gettingCourses&&
                <div className='h-[100vh] flex justify-center items-center text-2xl font-semibold text-gray-800'>
                  Getting courses
                  <svg aria-hidden="true" className="w-8 h-8 ml-5 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                </div>
              }
            </div>

          </div>

        </div>
      }
      {(!isMobile||tab=="Map")&&
      <>
      <div className={`flex flex-col items-center relative my-5 ${isMobile?"":"mr-8"} flex-grow`}>
      
        <LoadScript googleMapsApiKey="AIzaSyAuQ24lxsw65kbwnScndb9QYlJm-98d3rg">
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100%'
              }}
              center={center}
              zoom={zoom}
              onClick={()=>{
                if(mapRef.current&&mapRef.current.hasOwnProperty("state")){
                  setCenter({lat:mapRef.current.state.map.center.lat(), lng:mapRef.current.state.map.center.lng()})
                }
              }}
              ref={mapRef}

            >
              {articulatedCollegesWithName.map((articulationInformation, i)=>{
                if(articulationInformation.transferCourses.items.length>0){
                  const collegePosition = allLocations[articulationInformation.college]
                  const targetCollege = Object.keys(schoolNamesJSON).find(key => schoolNamesJSON[key] === selectedCollege)
                  const major = selectedMajorId&&majors.find(major=>major.id==selectedMajorId).name
                  const course = selectedCourseId&&courses.find(course=>course.id==selectedCourseId).name

                  return(
                    <MapMarker key={i} openedCollege={openedCollege} setOpenedCollege={setOpenedCollege} collegePosition={collegePosition} articulationInformation={articulationInformation} currentCoordinates={currentCoordinates} targetCollege={targetCollege} major={major} course={course}/>
                  

                  )
                }
              })
              }
            </GoogleMap>
          </LoadScript>

      </div>
      </>
      }
      
        
    </div>
    
    
  );
}

export default App;
