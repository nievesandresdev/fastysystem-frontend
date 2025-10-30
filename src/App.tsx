import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import router from './routes/index.js';
import { PermissionProvider } from './contexts/PermissionContext';
import { setOnPermissionDenied } from './api/http';
import { usePermission } from './contexts/PermissionContext';
import { useAppDispatch } from './hooks/store';
import { loadUser } from './stores/auth/authSlice';
import { useEffect } from 'react';

function AppContent() {
  const { showPermissionDenied } = usePermission();
  const dispatch = useAppDispatch();

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await window.authVault?.getUser?.();
        const token = await window.authVault?.getToken?.();
        
        if (user && token) {
          dispatch(loadUser({ user, token }));
        }
      } catch (error) {
        console.error('Error loading user from storage', error);
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    // Configurar el callback para manejar errores 403
    setOnPermissionDenied(showPermissionDenied);
  }, [showPermissionDenied]);

  return (
    <>
      <ToastContainer
        position="top-right"  
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  return (
    <PermissionProvider>
      <AppContent />
    </PermissionProvider>
  );
}

export default App;
