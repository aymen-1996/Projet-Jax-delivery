import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
import { forgotPassword } from '../services/userService'; // Import the resetPassword function

function Restpass() {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email } = data;
  
    try {
      const response = await forgotPassword(email);
      console.log('Forgot Password Response:', response);
  
      if (response.success) {
        // Redirect to the "/newpass" route after a successful request
        navigate('/newpass');
      } else {
        toast.error(response.message || 'Password reset request failed.');
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(`Password reset request failed: ${error.response.data.message}`);
      } else {
        console.error('Password reset request failed:', error);
        toast.error('Password reset request failed. Please try again.');
      }
    }
  };
  

  return (
    <div className="container-login">
      <div className="card">
        <div className="card-image">
          <img src="./logo.png" alt="" className="logo" />
        </div>
        <form className="card-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input">
            <input type="email" className="input-field" {...register('email', { required: true })} required />
            <label className="input-label">Email</label>
          </div>
        
          <div className="action">
            <button className="action-button" disabled={loading}>
              {loading ? <Spinner animation="border" variant="light" /> : 'Reset Password'}
            </button>
          </div>
        </form>
        <div className="card-info">
          <Link to="/login">Login ?</Link> <br /> <br />
          <Link to="/signup">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}

export default Restpass;
