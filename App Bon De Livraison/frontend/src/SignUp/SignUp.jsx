import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/actions/authActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const notify = () => toast.success('Compte créé avec succès!');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview

  const [formData, setFormData] = useState({
    nom: '',
    matriculeFiscale: '',
    email: '',
    gover: '',
    phoneNumber: '',
    fraisLivraison: '',
    password: '',
    logo: "", // Added for image upload
    adress: '', // Added for adress

  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'file' ? e.target.files[0] : value;

    if (type === 'file') {
      // Display image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(inputValue);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }));
  };
  const handleImageClick = () => {
    const fileInput = document.getElementById('logoInput');
    fileInput.click();
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      for (const key in formData) {
        if (formData[key] === "") {
          alert(`
          Veuillez remplir le champ du ${key} .`);
          return;
        }
      }
    
      if (!formData.logo) {
        alert(" Veuillez remplir le champ du logo.");
        return;
      }
    
      try {
        setLoading(true);
        const formDataForBackend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataForBackend.append(key, value);
        });
    
        const registerUser1 = await dispatch(registerUser(formDataForBackend))
        console.log(registerUser1);
        if (registerUser1) {
          if(registerUser1.payload.data.message==="Email already exists. Please choose a different email."){
            toast.error("L'adresse e-mail existe déjà. Veuillez choisir une adresse e-mail différente. ");
         
          setLoading(false);
        }if(registerUser1.payload.data.message==="User created successfully."){
          notify();
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }
                } else {
          toast.error('Error occurred, try again!');
        }
      
      } catch (error) {
        console.error("Registration failed:", error);
        alert(error.message || "An error occurred during registration.");
      } finally {
        setLoading(false);
      }
    };
    
    
    
  

  return (
    <div className="containerr">
      <ToastContainer />
      <div className="card">
        <div className="card-image">
        <p onClick={handleImageClick}>Choisir un logo :</p>
  {imagePreview && <img src={imagePreview} alt="Preview" />}
  <input
    type="file"
    name="logo"
    id="logoInput"
    style={{ display: 'none' }} // Hide the actual file input
    onChange={handleInputChange}
  />
        </div>
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="input">
            <input type="text" name="nom" className="input-field" value={formData.nom} onChange={handleInputChange} required />
            <label className="input-label">Nom</label>
          </div>
          <div className="input">
            <input type="text" name="matriculeFiscale" className="input-field" value={formData.matriculeFiscale} onChange={handleInputChange} required/>
            <label className="input-label">Matricule fiscale</label>
          </div>
          <div className="input">
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleInputChange} required/>
            <label className="input-label">Email</label>
          </div>
          <div className="input">
            <input
              type="text"
              name="adress"
              className="input-field"
              value={formData.adress}
              onChange={handleInputChange}
              required
            />
            <label className="input-label">Adresse</label>
          </div>

          <div className="input">
            <input type="text" name="gover" className="input-field" value={formData.gover } onChange={handleInputChange} required/>
            <label className="input-label">Governorat</label>
          </div>
          <div className="input">
            <input type="number" name="phoneNumber" className="input-field" value={formData.phoneNumber} onChange={handleInputChange} required/>
            <label className="input-label">Télephone</label>
          </div>
          <div className="input">
            <input type="number" name="fraisLivraison" className="input-field" value={formData.fraisLivraison} onChange={handleInputChange} required/>
            <label className="input-label">Prix Livraison</label>
          </div>
          <div className="input">
            <input type="password" name="password" className="input-field" value={formData.password} onChange={handleInputChange} required/>
            <label className="input-label">Mot de passe</label>
          </div>
          <div className="action">
            <button className="action-button">{loading ? <Spinner /> : 'Valider'}</button>
          </div>
        </form>
        <div className="card-info">
          <p>Vous avez un compte ?</p>
          <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
