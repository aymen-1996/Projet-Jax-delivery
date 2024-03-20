import React from 'react'
import NavBar from '../NavBar/NavBar'
import '../Home/Home.css'

import { Button } from 'react-bootstrap'
import { MdOutlineDocumentScanner } from "react-icons/md";
import { BsClipboardPlus } from "react-icons/bs";
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className='home'>
      <NavBar />
      <div>
        <Link to="/bl/:idUser/createbl">
          <Button className='btn-home'> 
            <p>Ajouter un BL</p> 
            <BsClipboardPlus className='icon'/>
          </Button>
        </Link>
        <Link to='/viewbl'>
          <Button className='btn-home'>  
            <p>Consulter vos BL</p>
            <MdOutlineDocumentScanner className='icon' />
          </Button>
        </Link>
      </div>
    </div>
  
  )
}

export default Home