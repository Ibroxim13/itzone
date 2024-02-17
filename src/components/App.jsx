import React, { useState } from 'react'
import Wrapper from './Wrapper'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from '../pages/Signin';

export default function App() {
  const [active, setActive] = useState(localStorage.getItem("user") ? true : false);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {
        active ? <Wrapper setActive={setActive} /> : <Signin setActive={setActive} />
      }
    </BrowserRouter>
  )
}
