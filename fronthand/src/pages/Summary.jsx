import React from 'react';
import LandingPage from './LandingPage';
import Features from './Features';
import Option from './Option';
import About from './About';
function Summary() {
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