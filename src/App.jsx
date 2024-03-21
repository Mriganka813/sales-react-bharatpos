import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./Components/SignIn"
import Home from "./Components/Home"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>

      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App