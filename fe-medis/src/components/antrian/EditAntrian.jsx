import React, { useEffect } from "react"; // Mengimpor React dan useEffect
import Layout from "../../pages/Layout"; // Mengimpor komponen Layout
import FormEditAntrian from "../pasien/FormEditPasien"; // Mengimpor form untuk mengedit antrian
import { useDispatch, useSelector } from "react-redux"; // Mengimpor hooks dari Redux
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk navigasi
import { getMe } from "../../features/authSlice"; // Mengimpor aksi untuk mendapatkan data pengguna

const EditAntrian = () => {
  const dispatch = useDispatch(); // Mendapatkan fungsi dispatch dari Redux
  const navigate = useNavigate(); // Mendapatkan fungsi navigate dari react-router
  const { isError } = useSelector((state) => state.auth); // Mengambil isError dari state auth

  useEffect(() => {
    dispatch(getMe()); // Mengambil data pengguna saat komponen dimuat
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/"); // Navigasi ke halaman utama jika terjadi kesalahan
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <FormEditAntrian /> {/* Menampilkan form untuk mengedit antrian */}
    </Layout>
  );
};

export default EditAntrian; // Mengekspor komponen EditAntrian
