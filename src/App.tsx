import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import router from './routes/index.js';

function App() {

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

export default App;
