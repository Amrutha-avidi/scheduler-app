import { Link } from 'react-router-dom'
import { GiRialtoBridge } from "react-icons/gi";

import './index.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-items1">
          <GiRialtoBridge size={45} />
          <h1 className="navbar-logo"><Link to='/' style={{ textDecoration: 'none', color: "white" }}>Skill Bridge</Link></h1>
        </div>
        <div className="navbar-items">
          <button className="navbar-button"><Link to='/profile' style={{ textDecoration: 'none', color: "white" }}>Profile</Link></button>
          <button className="navbar-button">Bookings</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar