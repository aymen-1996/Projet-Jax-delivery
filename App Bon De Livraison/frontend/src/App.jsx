import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login/Login';
import Restpass from './Restpass/Restpass';
import Newpass from './Newpass/Newpass';

import SignUp from './SignUp/SignUp';
import Home from './Home/Home';
import AddBL from './AddBL/AddBL';
import ViewBL from './ViewBL/ViewBL';
import { store, persistor } from './redux/store/store'; // Adjust the path based on your project structure
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import ProtectedRoute from './layout/ProtectedRoute';
import useAuth from './useAuth'; 
import Importex from './Importex/Importex';

function App() {
  const isAuthenticated = useAuth();
  console.log('isAuthenticated:', isAuthenticated);
  return (
    <div className='app'>
            <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={
        <Login />} />
         <Route path='/reset-password' element={
        <Restpass />} />
         <Route path='/newpass' element={
        <Newpass />} />


        <Route path='/signup' element={
        <SignUp />} />
        <Route path='/home' element={
          isAuthenticated ? (
            <ProtectedRoute> 
              <Home />
            </ProtectedRoute>
          ) : (
            // Redirect to login if not authenticated
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/bl/:idUser/createbl" element={
          isAuthenticated ? (
            <ProtectedRoute>
              <AddBL />
            </ProtectedRoute>
          ) : (
            // Redirect to login if not authenticated
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/viewbl" element={
          isAuthenticated ? (
            <ProtectedRoute>
              <ViewBL />
            </ProtectedRoute>
          ) : (
            // Redirect to login if not authenticated
            <Navigate to="/login" replace />
          )
        } />
       
         <Route path="/bl/:idUser/importex" element={
          isAuthenticated ? (
            <ProtectedRoute>
              <Importex />
            </ProtectedRoute>
          ) : (
            // Redirect to login if not authenticated
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
      </Provider>
      </PersistGate>

    </div>
  );
}

export default App;
