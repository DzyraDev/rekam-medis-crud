import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import RegisterUser from "./components/auth/Register";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

import Pasien from "./components/pasien/Pasien";
import AddPasien from "./components/pasien/AddPasien";
import EditPasien from "./components/pasien/EditPasien";


import ProfilPasien from "./components/profile-pasien/Pasien";
import ProfilPasienAdd from "./components/profile-pasien/AddPasien";
import ProfilPasienEdit from "./components/profile-pasien/EditPasien";

import Dokter from "./components/dokter/Dokter";
import AddDokter from "./components/dokter/AddDokter";
import EditDokter from "./components/dokter/EditDokter";


import ProfilDokter from "./components/profile-dokter/Dokter";
import ProfilDokterAdd from "./components/profile-dokter/AddDokter";
import ProfilDokterEdit from "./components/profile-dokter/EditDokter";

import RekamMedis from "./components/rekam-medis/RekamMedis";
import AddRekamMedis from "./components/rekam-medis/AddRekamMedis";
import EditRekamMedis from "./components/rekam-medis/EditRekamMedis";
import RekamMedisPrint from "./components/rekam-medis/RekamMedisPrint";


import Antrian from "./components/antrian/Antrian";
import AddAntrian from "./components/antrian/AddAntrian";
import EditAntrian from "./components/antrian/EditAntrian";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />

          <Route path="/pasien" element={<Pasien />} />
          <Route path="/pasien/add" element={<AddPasien />} />
          <Route path="/pasien/edit/:id" element={<EditPasien />} />

          <Route path="/profil-pasien" element={<ProfilPasien />} />
          <Route path="/profil-pasien/add" element={<ProfilPasienAdd />} />
          <Route
            path="/profil-pasien/edit/:id"
            element={<ProfilPasienEdit />}
          />

          <Route path="/profil-dokter" element={<ProfilDokter />} />
          <Route path="/profil-dokter/add" element={<ProfilDokterAdd />} />
          <Route
            path="/profil-dokter/edit/:id"
            element={<ProfilDokterEdit />}
          />

          <Route path="/dokter" element={<Dokter />} />
          <Route path="/dokter/add" element={<AddDokter />} />
          <Route path="/dokter/edit/:id" element={<EditDokter />} />

          <Route path="/rekam-medis" element={<RekamMedis />} />
          <Route path="/rekam-medis/add" element={<AddRekamMedis />} />
          <Route path="/rekam-medis/edit/:id" element={<EditRekamMedis />} />
          <Route path="/rekam-medis/print/:id" component={RekamMedisPrint} />

          <Route path="/antrian" element={<Antrian />} />
          <Route path="/antrian/add" element={<AddAntrian />} />
          <Route path="/antrian/edit/:id" element={<EditAntrian />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
