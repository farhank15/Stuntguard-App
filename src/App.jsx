import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appshell from "@components/templates/Appshell";
import Home from "@pages/home";
import About from "./components/templates/About";
import ArticlePage from "./components/templates/ArticlePage";
import ArticleList from "./components/templates/ArticleList";
import KalkulatorGizi from "./pages/KalkulatorGizi";
import AddMemberForm from "./components/molecules/AddMemberForm";
import EditMemberForm from "./components/molecules/EditMemberForm";
import DataOrangTua from "./pages/DataOrangTua";
import SignInForm from "./pages/Sign-In";
import SignUpForm from "./pages/Sign-Up";
import ForgotPassword from "./pages/ForgotPasswor";
import DataAnak from "./pages/DataAnak";
import TambahAnak from "./components/molecules/TambahAnak";
import AddChildForm from "./components/molecules/AddChildForm";

function App() {
  return (
    <Router>
      <Appshell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/artikel-kesehatan" element={<ArticleList />} />
          <Route path="/artikel-kesehatan/:id" element={<ArticlePage />} />
          <Route path="/kalkulator-gizi" element={<KalkulatorGizi />} />
          <Route path="/data-orangtua" element={<DataOrangTua />} />
          <Route path="/tambah-data-anggota" element={<AddMemberForm />} />
          <Route path="/edit-data/:id" element={<EditMemberForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/data-anak" element={<DataAnak />} />
          <Route path="/tambah-data-anak" element={<AddChildForm />} />
        </Routes>
      </Appshell>
    </Router>
  );
}

export default App;
