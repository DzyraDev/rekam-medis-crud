import React, { useEffect } from "react"; // Mengimpor React dan useEffect
import Layout from "../../pages/Layout"; // Mengimpor komponen Layout untuk membungkus tampilan
import { useDispatch, useSelector } from "react-redux"; // Mengimpor hook untuk mengakses Redux store
import { useNavigate } from "react-router-dom"; // Mengimpor hook untuk navigasi
import { getMe } from "../../features/authSlice"; // Mengimpor action untuk mengambil data pengguna
import AntrianList from "./AntrianList"; // Mengimpor komponen yang menampilkan daftar antrian

const Antrian = () => {
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
      <AntrianList /> {/* Menampilkan daftar antrian */}
    </Layout>
  );
};

export default Antrian; // Mengekspor komponen Antrian
