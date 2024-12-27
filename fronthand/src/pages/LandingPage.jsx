import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function LandingPage() {
    const navigate = useNavigate()
    const handleSubmit = ()=>{
        
        navigate('/LoginUp')
    }

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
     <div className='LandingPage-coantiner'>
     <div className='LandingPageContent '>
            <nav>
                <div className='navHeaader'>Sangam Video Call</div>
                <div className='navlist'>
                    <p><Link to={"/SignUp"} style={{ backgroundColor:"transparent",color:"white"}} >Register</Link></p>
                    <div role='button'><Link to={"/LoginUp"} style={{color:"white"}}>Login</Link></div>
                </div>
            </nav>
            <div className='LandingPageMainContent'>
                <div className='LandingPageMainContent-left'>
                    <h1 style={{color:"white"}}><span>Connect</span> With Your Loved Ones</h1>
                    <p>Cover a distance by Sangam Your Personalised Video Caller</p>
                    <button onClick={handleSubmit}>Get Started</button>
                </div>
                <div className="LandingPageMainContent-right">
                    <img src='/public/mobile.png'/>
                </div>
            </div>
        </div>
        </div>
    );
}

export default LandingPage;



