import React from 'react'
import { BsClipboardPlus } from "react-icons/bs";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";


export const SideBar=[
    {
        title:'Ajouter un bon de livraison',
        path:'/bl/:idUser/createbl',
        icon: <BsClipboardPlus />,
       
        cName:'nav-text'
    },
    {
        title:'Consulter vos bons de livraison',
        path:'/viewbl',
        icon:<MdOutlineDocumentScanner />,
        cName:'nav-text'
    },
    

];

