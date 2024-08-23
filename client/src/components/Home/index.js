import { Link } from 'react-router-dom';
import { BsGraphUpArrow } from "react-icons/bs";
import { PiBookOpenTextDuotone, PiPlugsConnected } from "react-icons/pi";



import './index.css';

const Home = () => {
  return (
    <div className="home">
      <section className="home-intro">
        <div>
          <p className="home-intro-para">
            <span>SkillBridge</span> is an innovative platform designed to connect students with industry professionals and mentors. Our goal is to bridge the gap between academic knowledge and real-world skills, helping you to enhance your career prospects and achieve your professional goals. Build your professional network by connecting with industry experts. Attend virtual and in-person events to expand your connections and explore new opportunities
          </p>
          <Link to='/profile' style={{ textDecoration: 'none' }}>
            <button className='home-button' href="#profile"><span>Get Started !</span></button>
          </Link>
        </div>
        <img className='home-img' src='https://res.cloudinary.com/drpddho9b/image/upload/v1724169209/Online_education_web_courses_concept_oht9dy.jpg' alt='home-image' />

      </section>


      <section className="home-features">
        <h2>Key Features</h2>
        <ul>
          <li style={{ borderColor: "rgb(245, 26, 63)" }}>
            <h3 style={{ color: "rgb(245, 26, 63)" }} >Connect with Mentors <PiPlugsConnected className='icons icon1' /></h3>
            <p>Get guidance and support from experienced professionals in your field of interest. Our mentors offer valuable insights, advice, and career coaching to help you navigate your career path.</p>
          </li>
          <li style={{ borderColor: 'rgb(19, 120, 160)' }}>
            <h3 style={{ color: 'rgb(19, 120, 160)' }}>Skill Development Workshops <BsGraphUpArrow className='icons icon2' /></h3>
            <p>Participate in exclusive workshops and training sessions designed to enhance your technical and soft skills. Our workshops cover a range of topics from programming and data analysis to communication and leadership.</p>
          </li>
          <li style={{ borderColor: "rgb(5, 122, 15)" }}>
            <h3 style={{ color: "rgb(5, 122, 15)" }}>Career Guidance <PiBookOpenTextDuotone className='icons icon3' /></h3>
            <p>Receive personalized career advice and support. Our platform provides resources such as resume reviews, interview preparation, and job search strategies to help you succeed in the job market.</p>
          </li>

        </ul>
      </section>

      <section className="home-how-it-works">
        <h2>How It Works</h2>
        <div className="definition-container">
          <div className="definition">
            <span style={{ color: "rgb(245, 26, 63)" }} className="keyword">Sign Up:</span>
            <span className="content">Create your account and complete your profile. Tell us about your interests, skills, and career goals to help us match you with the right mentors and opportunities.</span>
          </div>
          <div className="definition">
            <span className="keyword" style={{ color: 'rgb(19, 120, 160)' }}>Connect and Learn:</span>
            <span className="content">Engage with mentors, attend workshops, and participate in projects. Utilize the resources and support provided to enhance your skills and advance your career.</span>
          </div>
          <div className="definition">
            <span className="keyword" style={{ color: "rgb(5, 122, 15)" }}>Grow Your Career:</span>
            <span className="content">Apply the knowledge and skills you’ve gained to real-world situations. Leverage your connections and experiences to achieve your career goals and make a meaningful impact in your field.</span>          </div>
        </div>

      </section>

      <section className="home-why-choose">
        <h2>Why Choose SkillBridge?</h2>
        <ul>
          <li className='bg1'><h4>Expert Guidance:</h4> <p>Learn from industry leaders and experienced professionals who are dedicated to helping you succeed.</p></li>
          <li className='bg2'><h4>Comprehensive Resources:</h4> <p>Access a wide range of tools, resources, and opportunities designed to support your career growth.</p></li>
          <li className='bg3'><h4>Personalized Experience:</h4><p> Benefit from tailored advice and support that fits your unique needs and career aspirations.</p></li>
          <li className='bg4'><h4>Community and Support:</h4><p> Join a vibrant community of students and professionals committed to mutual growth and success.</p></li>
        </ul>
      </section>


    </div>
  );
};

export default Home;
