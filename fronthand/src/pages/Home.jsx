import { useEffect, useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import '../styles/home.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../Util';
function Home() {
    const [meetingCode, setMeetingCode] = useState("");
    const token = localStorage.getItem("token:")
    const email = localStorage.getItem("email")
    let navigate = useNavigate();
    let handleJoinMetting = async()=>{
        try
        {

        const data = {
            token:token,
            email:email,
            meeting_code:meetingCode
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/addToHistory`;
        const response = await fetch(url,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }
    )
    const result =await response.json();
    const {success,message,error} = result
    if(success){
               
        navigate(`/${meetingCode}`)
    }
    else if(error){
        let detail =error?.details[0].message;
        handleError(detail)
    }
}
    catch(error){
        console.log("error in addToHistory Fronthand",error);
        
    }
}

    let handleHistory = async()=>{

        navigate('/history')


    }

    return (
        <div className='home'>
            <nav>
                <h2><span style={{color:"yellow"}}>S</span>angam</h2>
                <div className='nav-Lfet'>

                    <button onClick={handleHistory}>History</button>
                    <button onClick={()=>{
                        localStorage.removeItem("token:")
                        localStorage.removeItem("email")
                        navigate("/")
                    }}>LogOut</button>
                </div>

            </nav>
            <div className='home-MainContent'>
                <div className="left-com">
                    <div className='inner-left-com'>
                        <h1><span style={{color:"yellow"}}>S</span>angam:Your Personalized Video Call</h1><hr/>
                        <h2>Seamless Video Communication</h2>
                        <p>Connect with your loved ones or collaborate with your team in high-definition video calls.</p>
                        <div className="joinCall-conatiner">
                        <TextField onChange={e =>setMeetingCode(e.target.value)} id="outlined-search" label="Metting Code"  sx={{color:"white",backgroundColor:"white",width:"70%",border:"none"}}/>
                        <Button variant="contained" onClick={handleJoinMetting}>Join Call</Button>
                        </div>
                    </div>
                </div>
                <div className="right-com">
                    <img src='/Bg-3-Photoroom.png' alt='Check Internet connection'></img>

                </div>
            </div>


        </div>
    ); 
}

export default Home;
