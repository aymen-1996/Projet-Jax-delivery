import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SideBar } from '../SideBar/SideBar';

import { BsClipboardPlus } from "react-icons/bs";
import { MdOutlineDocumentScanner } from "react-icons/md";

import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';

const NavBar = () => {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => setSidebar(!sidebar);
  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming you use a token for authentication
    // Add other data removals if necessary
  
    // Redirect to the login page or any other page after logout
    window.location.href = '/login'; // Change the path accordingly
  
      console.log('User logged out');
  };

  return (
    <div className='navbar-container'>
      <Navbar expand='lg' className='navbar'>
        <Container>
        <Link to='/home' className='nav-link'>

          <Navbar.Brand href='#'>
            <img
              src='/logo.png' 
              alt='Logo'
              width='50'
              height='50'
              className='d-inline-block align-top'
            />
          </Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              {/* Hardcoded items */}
              <Link to='/home' className='nav-link'>
              Accueil
              </Link>
              {/* Dynamic items from SideBar */}
              {SideBar.map((item, index) => (
                <Link key={index} to={item.path} className='nav-link'>
                  {item.icon === 'BsClipboardPlus' && <BsClipboardPlus />}
                  {item.icon === 'MdOutlineDocumentScanner' && <MdOutlineDocumentScanner />}
                  <span>{item.title}</span>
                </Link>
              ))}
                        <Link to='/logout' className='nav-link' onClick={handleLogout}>
                        Se déconnecter
          </Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={toggleSidebar}>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              <AiOutlineClose />
            </Link>
          </li>
          {/* Dynamic items from SideBar */}
          {SideBar.map((item, index) => (
  <Link key={index} to={item.path} className='nav-link'>
    {item.icon === 'BsClipboardPlus' && <BsClipboardPlus />}
    {item.icon === 'MdOutlineDocumentScanner' && <MdOutlineDocumentScanner />}
    <span>{item.title}</span>
  </Link>
))}

        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
