import React, { useState,useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import NavBar from '../NavBar/NavBar';
import { createBL } from '../redux/actions/blActions';
 // Import the generatePdf action
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import { ToastContainer, toast } from 'react-toastify';
import BASE_URL from '../services/apiConfig';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import { FaFileImport } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';


import './AddBl.css';

function AddBL() {
  const dispatch = useDispatch();
  const TunisiaGovernorates = [
    'Ariana',
    'Béja',
    'Ben Arous',
    'Bizerte',
    'Gabès',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kebili',
    'Kef',
    'Mahdia',
    'Manouba',
    'Medenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis', // the capital
    'Zaghouan',
  ];
  const userId = useSelector((state) => state.auth.user?.id);
  const [blId, setBlId] = useState(null); // State to store the BL ID
  const navigate = useNavigate(); // Get the navigate function from React Router
	const notify = () => toast.success('BL created successfully !');
  const [delegations, setDelegations] = useState(['Béni Khalled', 'Khiar', 'Bou Argoub', 'Dar', 'Chaâbane El Fehri', 'ELHaouaria', 'El Mida', 'Grombalia', 'Hammam Ghezèze', 'Hammamet', 'Kélibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa']);

  const [formData, setFormData] = useState({
    nomDest: '',
    numTelephone1: '',
    numTelephone2: '',
    address: '',
    gov: '',
    delegation: '',
    desc: '',
    prixHliv: '',
  });
  const {handleSubmit, register } = useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name === 'gov') {
      const selectedGovernorate = value.toLowerCase();

      let delegationsForGovernorate = [];
      switch (selectedGovernorate) {
        case 'nabeul':
          delegationsForGovernorate = ['Béni Khalled', 'Béni Khiar', 'Bou Argoub', 'Dar Chaâbane El Fehri', 'El Haouaria', 'El Mida', 'Grombalia', 'Hammam Ghezèze', 'Hammamet', 'Kélibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa'];
          break;
        case 'béja':
          delegationsForGovernorate = ['Belkhir', 'El Guettar', 'El Ksar', 'Gafsa Nord', 'Gafsa Sud', 'Mdhilla', 'Métlaoui', 'Moularès', 'Redeyef', 'Sened', 'Sidi Aïch'];
          break;
        case 'ben arous':
          delegationsForGovernorate = ['Ben Arous', 'Bou Mhel', 'el-Bassatine', 'El Mourouj', 'Ezzahra', 'Fouchana', 'Hammam Chott', 'Hammam Lif', 'Mohamedia', 'Medina Jedida', 'Mégrine', 'Mornag', 'Radès'];
          break;
        case 'bizerte':
          delegationsForGovernorate = ['Bizerte Nord', 'Bizerte Sud', 'El Alia', 'Ghar El Melh', 'Ghezala', 'Joumine', 'Mateur', 'Menzel Bourguiba', 'Menzel Jemil', 'Ras Jebel', 'Tinja', 'Utique', 'Zarzouna'];
          break;
        case 'gabès':
          delegationsForGovernorate = ['Gabès Médina', 'Gabès Ouest', 'Gabès Sud', 'Ghannouch', 'El Hamma', 'Matmata', 'Mareth', 'Menzel El Habib', 'Métouia', 'Nouvelle Matmata'];
          break;
        case 'gafsa':
          delegationsForGovernorate = ['Belkhir', 'El Guettar', 'El Ksar', 'Gafsa Nord', 'Gafsa Sud', 'Mdhilla', 'Métlaoui', 'Moularès', 'Redeyef', 'Sened', 'Sidi Aïch'];
          break;
        case 'jendouba':
          delegationsForGovernorate = ['Aïn Draham', 'Balta-Bou Aouane', 'Bou Salem', 'Fernana', 'Ghardimaou', 'Jendouba Sud', 'Jendouba Nord', 'Oued Meliz', 'Tabarka'];
          break;
        case 'kairouan':
          delegationsForGovernorate = ['Bou Hajla', 'Chebika', 'Echrarda', 'El Alâa', 'Haffouz', 'Hajeb El Ayoun', 'Kairouan Nord', 'Kairouan Sud', 'Nasrallah', 'Oueslatia'];
          break;
        case 'kasserine':
          delegationsForGovernorate = ['El Ayoun', 'Ezzouhour', 'Fériana', 'Foussana', 'Haïdra', 'Hassi El Ferid', 'Jedelienne', 'Kasserine Nord', 'Kasserine Sud', 'Majel Bel Abbès', 'Sbeïtla', 'Sbiba', 'Thala'];
          break;
        case 'kebili':
          delegationsForGovernorate = ['Kasserine Nord', 'Sbeïtla', 'Fériane', 'Sbiba', 'Foussana', 'Thala', 'Majel Bel Abbès', 'Kasserine Sud', 'Ezzouhour', 'El Ayoun', 'Hassi El Ferid', 'Jedelienne', 'Haïdra'];
          break;
        case 'kébili':
          delegationsForGovernorate = ['Kébili Nord', 'Kébili Sud', 'Douz Nord', 'Douz Sud', 'Souk Lahad', 'Faouar'];
          break;
        case 'kef':
          delegationsForGovernorate = ['Le Kef Est', 'Le Kef Ouest', 'Dahmani', 'Tajerouine', 'Nebeur', 'Sers', 'Sakiet Sidi Youssef', 'El Ksour', 'Kalaat Senan', 'Jérissa', 'Kalâat Khasba'];
          break;
        case 'mahdia':
          delegationsForGovernorate = ['Mahdia', 'Ksour Essef', 'Essouassi', 'El Jem', 'Sidi Alouane', 'Bou Merdes', 'Chorbane', 'Chebba', 'Hebira', 'Melloulèche', 'Ouled Chamekh', 'Rejiche', 'El Bradâa'];
          break;
        case 'manouba':
          delegationsForGovernorate = ['Ettadhamen', 'Douar Hicher', 'Oued Ellil', 'La Manouba', 'Tebourba', 'Djedeida', 'Mornagia', 'El Batan', 'Borj El Amri'];
          break;
        case 'medenine':
          delegationsForGovernorate = ['Zarzis', 'Ben Gardane', 'Djerba-HoumtSouk', 'Djerba-Midoun', 'Médenine Nord', 'Médenine Sud', 'Beni Khedache', 'Djerba-Ajim', 'Sidi Makhlouf'];
          break;
        case 'monastir':
          delegationsForGovernorate = ['Monastir', 'Moknine', 'Jemmal', 'Ksar Hellal', 'Téboulba', 'Ksibet el-Médiouni', 'Bembla', 'Zéramdine', 'Syada-Lamta-Bou Hajar', 'Sahline', 'Ouerdanine', 'Bekalta', 'Beni Hassen'];
          break;
        case 'sfax':
          delegationsForGovernorate = ['Sfax Ville', 'Sfax Ouest', 'Sfax Sud', 'Sakiet Eddaïer', 'Sakiet Ezzit', 'Bir Ali Ben Khalifa', 'Thyna', 'Jebiniana', 'El Hencha', 'Agareb', 'Menzel Chaker', 'Mahrès', 'Skhira', 'El Amra', 'Graïba', 'Kerkennah'];
          break;
        case 'sidi bouzid':
          delegationsForGovernorate = ['Sidi Bouzid Ouest', 'Sidi Bouzid Est', 'Regueb', 'Mezzouna', 'Meknassy', 'Ouled Haffouz', 'Souk Jedid', 'Cebbala Ouled Asker', 'Menzel Bouzaiane', 'Sdid Ali Ben Aoun', 'Bir El Hafey', 'Jilma'];
          break;
        case 'siliana':
          delegationsForGovernorate = ['Makthar', 'Rouhia', 'Siliana Sud', 'Siliana Nord', 'El Krib', 'Bou Arada', 'Gaâfour', 'Kesra', 'Sidi Bous Roulis', 'Bargou', 'El Aroussa'];
          break;
        case 'sousse':
          delegationsForGovernorate = ['M"saken', 'Sousse Riadh', 'Sousse Jawhara', 'Kalâa Kebira', 'Sidi Abdelhamid', 'Enfida', 'Hammam Sousse', 'Sousse Médina', 'Kalâa Seghira', 'Akouda', 'Bouficha', 'Sidi Bou Ali', 'Kondar', 'Sidi El Hani', 'Hergla'];
          break;
        case 'tataouine':
          delegationsForGovernorate = ['Tataouine Nord', 'Tataouine Sud', 'Ghomrassen', 'Smâr', 'Remada', 'Bir Lahmar', 'Dehiba'];
          break;
        case 'tozeur':
          delegationsForGovernorate = ['Tozeur', 'Degache', 'Nefta', 'Tameghza', 'Hazoua'];
          break;
        case 'tunis':
          delegationsForGovernorate = ['Hraïria', 'El Kabaria', 'Sidi Hassine', 'La Marsa', 'Le Bardo', 'El Omrane supérieur', 'Le Kram', 'El Menzah', 'El Omrane', 'Ezzouhour', 'Bab El Bhar', 'Cité El Khadra', 'Séjoumi', 'El Ouardia', 'Bab Souika', 'Sidi El Béchir', 'La Goulette', 'Médina', 'Djebel Jelloud', 'Ettahrir', 'Carthage'];
          break;
        case 'zaghouan':
          delegationsForGovernorate = ['El Fahs', 'Zaghouan', 'Nadhour', 'Bir Mcherga', 'Zriba', 'Saouaf'];
          break;
          case 'ariana':
            delegationsForGovernorate = ['Béni Khalled', 'Khiar', 'Bou Argoub', 'Dar', 'Chaâbane El Fehri', 'ELHaouaria', 'El Mida', 'Grombalia', 'Hammam Ghezèze', 'Hammamet', 'Kélibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa'];
            break;
        
  
          
        // Add cases for other governorates
        // ...

        default:
          break;
      }

      setDelegations(delegationsForGovernorate);
    }


    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // Redirect to the URL with the actual user ID when the component mounts
    if (userId) {
      navigate(`/bl/${userId}/createbl`);
    }
  }, [navigate, userId]);





    // Dispatch the createBL action and get the BL ID from the payload
    const handleFormSubmit = async () => {
      try {
        // Input validation checks
        if (!formData.nomDest || !formData.numTelephone1  || !formData.address   || !formData.desc || !formData.prixHliv) {
          // Display an error message or handle validation as needed
          alert('Veuillez remplir tous les champs obligatoires.');
          return;
        }
  
        // Dispatch the createBL action with the combined form data
        const { payload: createdBL } = await dispatch(createBL({ userId, blData: formData }));
  
        if (createdBL) {
          notify();
          setBlId(createdBL);
        } else {
          console.error('Invalid BL data received:', createdBL.id);
        }
      } catch (error) {
        console.error('Error creating BL:', error);
      }
    };
    
  

  const handleGeneratePdfClick = () => {
    if (blId) {
      const downloadUrl = `${BASE_URL}/bl/${blId}/file`;
      window.location.href = downloadUrl;

    } else {
      // Handle the case where the BL ID is not available
      console.error('BL ID not available');
    }
  };
  const handleExcelFile= async () => {
    

    try {
      const downloadUrl = `${BASE_URL}/upload-groupe/download`;
      window.location.href = downloadUrl;
        // You may want to handle success and navigation logic here
      console.log('File downloaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
    <NavBar />
  
    <div className='import'>
    <div className='buttons-container'>
   
      <Button className='btn-modéle' onClick={ handleExcelFile}> 
        <p>Télécharger Modèle</p>
        <FaFileDownload />
      </Button>
  
    
    
    <Link to="/bl/:idUser/importex">
      <Button className='btn-excel'> 
        <p>Importer un fichier</p>
        <FaFileImport />
      </Button>
    </Link>
  
   
  </div>
</div>
    
        
      


        <div className='form-bl'>

        
    <Form onSubmit={handleSubmit(handleFormSubmit)}  >
    <div className="InfoDest">
   
        <Form.Label className='saisie'>Saisir ici les données de votre destinataire :</Form.Label>
       <Row className="mb-3">
         <Form.Group as={Col} md="4" controlId="nom">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              {...register('nomDest', { required: true })}
              type="text"
              placeholder="Nom"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="numTelephone1">
            <Form.Label>Téléphone 1</Form.Label>
            <Form.Control
              {...register('numTelephone1', { required: true })}
              type="tel"
              placeholder="Téléphone 1"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="numTelephone2">
            <Form.Label>Téléphone 2</Form.Label>
            <Form.Control
              {...register('numTelephone2', { required: true })}
              type="tel"
              placeholder="Téléphone 2"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
         </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="address">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              {...register('address', { required: true })}
              type="text"
              placeholder="Adresse"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="gov">
  <Form.Label>Governorat</Form.Label>
  <Form.Select
  {...register('gov', { required: true })}
  name="gov"
  onChange={handleInputChange}
>
  {TunisiaGovernorates.map((governorate, index) => (
    <option key={index} value={governorate.toLowerCase()}>
      {governorate}
    </option>
  ))}
</Form.Select>
</Form.Group>
<Form.Group as={Col} md="4" controlId="delegation">
        <Form.Label>Délégation</Form.Label>
        <Form.Select {...register('delegation', { required: true })}  
         name="delegation"
  onChange={handleInputChange}
>
          {delegations.map((delegation, index) => (
            <option key={index} value={delegation}>
              {delegation}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
        </Row>
        </div>
    <div className="InfoColis">
    <Form.Label className='saisie'>Saisir ici les données de votre colis :</Form.Label>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              {...register('desc', { required: true })}
              as="textarea"
              rows={3}
              placeholder="Enter description"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="montantHLiv">
            <Form.Label>Montant Hors Livraison</Form.Label>
            <Form.Control
              {...register('prixHliv', { required: true })}
              type="number"
              placeholder="Enter Montant Hors Livraison"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
    </div>
   
 <hr />
  <div className="button-container">
    <button type="button" className='btnv' onClick={handleFormSubmit}>
      Valider
    </button>
    <button type="button" className='btnp' onClick={handleGeneratePdfClick}>
      Télécharger PDF
    </button>
    
  </div>
  </Form>
  </div>
</div>
  
);

}

export default AddBL;
