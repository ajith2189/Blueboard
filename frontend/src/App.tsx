import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/auth/UserRegister";
// import OtpVerification from "./pages/OtpVerificationModal";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<UserRegister />} />
        {/* <Route path="/otp" element={<OtpVerification />} /> */}
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}
