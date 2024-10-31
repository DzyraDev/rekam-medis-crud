import React, { useEffect } from "react"; // Mengimpor React dan useEffect
import Layout from "../../pages/Layout"; // Mengimpor komponen Layout
import { useDispatch, useSelector } from "react-redux"; // Mengimpor hook untuk mengakses Redux store
import { useNavigate } from "react-router-dom"; // Mengimpor hook untuk navigasi
import { getMe } from "../../features/authSlice"; // Mengimpor action untuk mengambil data pengguna
import FormAddAntrian from "./FormAddAntrian"; // Mengimpor komponen form untuk menambah antrian

const AddAntrian = () => {
  const dispatch = useDispatch(); // Mendapatkan fungsi dispatch dari Redux
  const navigate = useNavigate(); // Mendapatkan fungsi navigasi
  const { isError } = useSelector((state) => state.auth); // Mengambil status error dari state auth

  useEffect(() => {
    dispatch(getMe()); // Memanggil action untuk mendapatkan data pengguna saat komponen di-mount
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/"); // Jika ada error, navigasi kembali ke halaman utama
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <FormAddAntrian /> {/* Menampilkan form untuk menambah antrian */}
    </Layout>
  );
};

export default AddAntrian; // Mengekspor komponen AddAntrian
