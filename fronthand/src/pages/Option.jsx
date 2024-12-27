import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Option.css'
function Option() {
    const navigate = useNavigate()
    return (
        <div className='option-Conatiner'>
        <div className='option'>
            <div className='optionleft'>

                <h1>Start Connecting in<br /><span className='opting-3step'>3 Easy Steps</span></h1>
                <button onClick={()=>navigate("/LoginUp")} style={{backgroundColor:"tomato",padding:"0.7rem 0.5rem"}}>Start Your Video Call <i class="fa-solid fa-arrow-right" style={{ color: "#fff"}}></i></button>
            
            </div>
            <div className='optionRight'>
                <div className='optionRight-content'>
                    <i class="fa-solid fa-1 fa-4x"></i>
                    <h1>Join</h1>
                    <p>Click on the Join button to start your video call journey.</p>
                </div>
                <div className='optionRight-content'>
                    <i class="fa-solid fa-2 fa-4x"></i>
                    <h1>Connect</h1>
                    <p>Enter your meeting code or invite your loved ones to connect instantly.</p>
                </div>
                <div className='optionRight-content'>
                    <i class="fa-solid fa-3 fa-4x"></i>
                    <h1>Engage</h1>
                    <p>Enjoy seamless video calling with high-quality audio and video.</p>
                </div>
            </div>

        </div>
        </div>
    );
}

export default Option;