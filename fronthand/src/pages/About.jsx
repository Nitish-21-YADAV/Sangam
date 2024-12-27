import React from "react";
import "../styles/About.css"; 

function AboutPage() {
  return (
    <div className="about-coantiner">
    <div className="about-page">
      <header className="about-header">
        <h1>About Sangam Video Call</h1>
        <p>
          Bridging distances and connecting hearts with seamless video call
          technology.
        </p>
      </header>
      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Sangam, our mission is to provide a reliable and personalized
            video calling platform to bring people closer, no matter where they
            are. Whether it's connecting with family, friends, or colleagues, we
            make communication simple and meaningful.
          </p>
        </div>
        <div className="about-section">
          <h2>Why Choose Sangam?</h2>
          <ul>
            <li>High-quality video and audio calling experience.</li>
            <li>User-friendly interface with quick connection setup.</li>
            <li>Secure and private communication for peace of mind.</li>
            <li>Cross-platform compatibility for desktop and mobile devices.</li>
          </ul>
        </div>
        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            We envision a world where technology erases barriers, creating
            opportunities for people to connect, share, and grow together. Sangam
            is your bridge to meaningful communication.
          </p>
        </div>
      </section>
      <footer className="about-footer">
        <p>© 2024 Sangam Video Call - Connecting the World, One Call at a Time.</p>
      </footer>
    </div>
    </div>
  );
}

export default AboutPage;