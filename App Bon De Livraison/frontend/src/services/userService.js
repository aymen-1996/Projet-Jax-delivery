import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from './apiConfig';

export const loginUser = async (email, password, navigate) => {
    const response = await axios.post(`${BASE_URL}/api/login`, { email, password }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });


    // Assuming the response contains necessary user and token data
    const { user, succes, token, message } = await response.data;
    if (succes) {
        localStorage.setItem('token', token);
        toast.success("Utilisateur connecté avec succès.");
        navigate('/home');
        return user;
    } else {
        toast.error("Votre email et/ou votre mot de passe est incorrect.");
        return null;
    }
}
export const resetPassword = async (email, resetCode, newPassword) => {
    try {
        // Convert resetCode to a number if it's a string
        resetCode = Number(resetCode);

        const response = await axios.post(`${BASE_URL}/api/reset-password`, {
            email,
            resetCode,
            newPassword,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { message } = response.data;
        return { success: true, message };
    } catch (error) {
        console.error('Error during password reset:', error); // Log the entire error object for debugging

        if (error.response && error.response.data) {
            const { message } = error.response.data;
            return { success: false, message };
        } else if (error.request) {
            console.error('No response received from the server:', error.request);
            return {
                success: false,
                message: 'No response received from the server. Please try again.',
            };
        } else {
            console.error('Error during request setup:', error.message);
            return {
                success: false,
                message: 'An error occurred during password reset. Please try again.',
            };
        }
    }
};

  
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/request-password-reset`, { email }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { message } = response.data;
        toast.success("Le code de réinitialisation du mot de passe a été envoyé avec succès. Veuillez vérifier votre messagerie électronique.");

        // Return a success indicator or additional information if needed
        return { success: true, message };
    } catch (error) {
        console.error('Password reset request failed:', error);
        toast.error('Failed to send password reset request. Please try again.');

        // Return a failure indicator or additional information if needed
        return { success: false, message: 'Failed to send password reset request' };
    }
};


export const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    return token !== null && token.length > 0;
}
export default isAuthenticated;
