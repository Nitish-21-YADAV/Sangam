import React from 'react';
import { useNavigate } from 'react-router-dom';
function Features() {
    const navigate = useNavigate()
    return (
        <div className='features-container'>
            <div className='features'>
                <div className='featuresLeft'>
                    <h2>Empowering Connections Across Industries and Distances</h2>
                    <p>Sangam revolutionizes the way you connect, bridging distances to bring people closer. Whether it's a business meeting, a classroom discussion, a medical consultation, or catching up with loved ones, Sangam simplifies communication, enabling seamless collaboration anytime, anywhere</p>
                    <button onClick={()=>navigate("/LoginUp")} style={{backgroundColor:"tomato"}}>Discover Sangam's Solutions Today</button>
                </div>
                <div className='featuresRight'>
                    <div className='featuresRight-Conatiner'>
                        <div className='featuresRight-Left'>
                            <div className='featuresRight-Values'>
                                <i class="fa-sharp-duotone fa-solid fa-graduation-cap"></i>
                                <h2>Education</h2>
                            </div>
                            <div className='featuresRight-Values'>
                                <i class="fa-solid fa-sack-dollar"></i>
                                <h2>Financial Services</h2>
                            </div>
                            <div className='featuresRight-Values'>
                                <i class="fa-solid fa-house"></i>
                                <h2>Government</h2>
                               
                            </div>
                        </div>
                        <div className='featuresRight-Right'>
                            <div className='featuresRight-Values'>
                                <i class="fa-solid fa-hospital"></i>
                                <h2>HealthCare</h2>
                            </div>
                            <div className='featuresRight-Values'>
                                <i class="fa-solid fa-box-open"></i>
                                <h2>Manufacturing</h2>
                            </div>
                            <div className='featuresRight-Values'>
                                <i class="fa-solid fa-ribbon"></i>
                                <h2>Retail</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;