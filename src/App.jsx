import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./Components/SignIn"
import Home from "./Components/Home"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from "./Components/ForgetPassword";
import AllSales from "./Components/AllSales";
import AllSubusers from "./Components/AllSubusers";
import EditSubUser from "./Components/EditSubUser";
import AddSubUser from "./Components/AddSubUser";

const App = () => {
  return (
    <>

      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/sales-all" element={<AllSales />} />
          <Route path="/subusers-all" element={<AllSubusers />} />
          <Route path="/subuser/:id" element={<EditSubUser />} />
          <Route path="/subuser/new" element={<AddSubUser />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App