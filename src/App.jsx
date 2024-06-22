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
import ForgotPassword from "./pages/ForgotPassword";
import DataAnak from "./pages/DataAnak";
import AddChildForm from "./components/molecules/AddChildForm";
import EditFormChild from "@/pages/EditFormChild";
import EventSchedule from "./pages/EventSchedule";
import ManageEvents from "./pages/ManageEvents";
import PrivateRoute from "./utils/ProtectedRoute";

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
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventSchedule />
              </PrivateRoute>
            }
          />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes for admin only */}
          <Route
            path="/data-orangtua"
            element={
              <PrivateRoute role="admin">
                <DataOrangTua />
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-data-anggota"
            element={
              <PrivateRoute role="admin">
                <AddMemberForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-data/:id"
            element={
              <PrivateRoute role="admin">
                <EditMemberForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/data-anak"
            element={
              <PrivateRoute role="admin">
                <DataAnak />
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-data-anak"
            element={
              <PrivateRoute role="admin">
                <AddChildForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-data-anak/:id"
            element={
              <PrivateRoute role="admin">
                <EditFormChild />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-events"
            element={
              <PrivateRoute role="admin">
                <ManageEvents />
              </PrivateRoute>
            }
          />
        </Routes>
      </Appshell>
    </Router>
  );
}

export default App;
