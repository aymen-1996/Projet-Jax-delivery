// redux/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux'; // Import combineReducers
import authReducer from '../slices/authslice';
import blReducer from '../slices/blSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  bl: blReducer,
  // Add other reducers as needed
});

// Configure redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persistedReducer
const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
