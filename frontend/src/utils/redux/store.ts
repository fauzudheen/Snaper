import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import { AuthState } from '../../types/types';

const persistConfig = {
  key: 'auth',
  storage,
};

// Export the type for the entire store state
export interface RootState {
  auth: AuthState;
}

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']// Ignore specific actions for serialization to prevent warnings
      },
    }),
});

const persistor = persistStore(store);

// Export types for dispatch and state
export type AppDispatch = typeof store.dispatch;

export { store, persistor };