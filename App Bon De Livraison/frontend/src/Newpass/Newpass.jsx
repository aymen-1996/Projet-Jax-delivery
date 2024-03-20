import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
import { resetPassword } from '../services/userService'; // Import the resetPassword function

function Newpass() {
    const loading = useSelector((state) => state.auth.loading);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
      const { email, resetCode, newPassword } = data;
  
      try {
          const response = await resetPassword(email, resetCode, newPassword);
          console.log('Reset Password Response:', response);
  
          if (response.success) {
              toast.success('Réinitialisation du mot de passe réussie. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
              navigate('/login'); // Redirect to login page after successful password reset
          } else {
              // Handle unsuccessful password reset (success is false)
              // Do not show a success notification or redirect to login page
              toast.error(`Veuillez vérifier les champs.`);
          }
      } catch (error) {
          // Handle other types of errors or provide a generic error message
          if (error.response && error.response.data) {
              toast.error(`Password reset failed: ${error.response.data.message}`);
          } else {
              console.error('Password reset failed:', error);
              toast.error('An error occurred during password reset. Please try again.');
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
                    <div className="input">
                        <input type="number" className="input-field" {...register('resetCode', { required: true })} required />
                        <label className="input-label">Reset Code</label>
                    </div>
                    <div className="input">
                        <input type="password" className="input-field" {...register('newPassword', { required: true })} required />
                        <label className="input-label">New Password</label>
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

export default Newpass;
