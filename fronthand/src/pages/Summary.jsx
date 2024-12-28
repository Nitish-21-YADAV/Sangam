import React from 'react';
import LandingPage from './LandingPage';
import Features from './Features';
import Option from './Option';
import About from './About';
import { useEffect } from 'react';
function Summary() {
    useEffect(() => {
        alert("To access the Services, you need to SignUp. All the images Everything is for educational purpose");
    }, []);
    return (
        <div>
            <LandingPage/>
            <Option/>
            <Features/>
            <About/>
        </div>
    );
}

export default Summary;