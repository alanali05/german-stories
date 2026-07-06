import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/german/Home";
import BottomNavbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
import StoryPage from "./pages/german/Test";
import Translator from "./pages/german/translation";



export default function App() {
  return (
    <BrowserRouter>
      <BottomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:storyId" element={<StoryPage />} />
        <Route path="/translator" element={<Translator />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="*" element={<h1 className="text-white p-10">404 — Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}