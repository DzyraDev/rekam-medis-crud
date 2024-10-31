import React, { useEffect, useState } from "react"; // Mengimpor React dan hooks useEffect, useState
import axios from "axios"; // Mengimpor axios untuk melakukan permintaan HTTP
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk navigasi

const FormEditAntrian = () => {
  const [gejala, setGejala] = useState(""); // State untuk menyimpan gejala
  const [nama_pasien, setPasien] = useState(""); // State untuk menyimpan ID pasien
  const [nama_dokter, setDokter] = useState(""); // State untuk menyimpan ID dokter
  const [msg, setMsg] = useState(""); // State untuk menyimpan pesan
  const [dokter, setDoctors] = useState([]); // State untuk menyimpan daftar dokter
  const [isLoading, setIsLoading] = useState(false); // State untuk menandai status loading
  const navigate = useNavigate(); // Mendapatkan fungsi navigate dari react-router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, antrianRes] = await Promise.all([
          axios.get("http://localhost:5000/dokter"), // Mengambil data dokter
          axios.get("http://localhost:5000/antrian/1"), // Mengambil data antrian berdasarkan ID
        ]);

        setDoctors(doctorsRes.data); // Menyimpan data dokter
        setGejala(antrianRes.data.gejala); // Mengisi gejala dengan data antrian
        setPasien(antrianRes.data.id_pasien); // Mengisi ID pasien dengan data antrian
        setDokter(antrianRes.data.id_dokter); // Mengisi ID dokter dengan data antrian
      } catch (error) {
        console.error("Error fetching data:", error);
        setMsg("Error mengambil data."); // Menyimpan pesan error
      }
    };

    fetchData(); // Memanggil fungsi untuk mengambil data
  }, []);

  const saveAntrian = async (e) => {
    e.preventDefault(); // Mencegah perilaku default form
    setIsLoading(true); // Mengatur status loading

    try {
      const payload = {
        gejala: gejala,
        id_pasien: nama_pasien,
        id_dokter: nama_dokter,
      };

      const response = await axios.put(
        "http://localhost:5000/antrian/1", // Mengupdate antrian dengan ID
        payload
      );

      if (response.data) {
        navigate("/antrian"); // Navigasi kembali ke halaman antrian setelah sukses
      }
    } catch (error) {
      console.error("Error updating antrian:", error);
      setMsg("Error menyimpan data."); // Menyimpan pesan error
    } finally {
      setIsLoading(false); // Mengatur status loading kembali
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-white">Edit Antrian</h1>
            <p className="mt-2 text-blue-100">Silakan edit detail berikut</p>
          </div>
          <div className="p-6">
            <form onSubmit={saveAntrian} className="space-y-6">
              {msg && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-700">{msg}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gejala
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={gejala}
                    onChange={(e) => setGejala(e.target.value)}
                    placeholder="Jelaskan gejala yang Anda alami"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pilih Dokter
                  </label>
                  <select
                    value={nama_dokter}
                    onChange={(e) => setDokter(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Pilih Dokter</option>
                    {dokter.map((dokter) => (
                      <option
                        key={dokter.id_dokter}
                        value={dokter.id_dokter}
                        className="text-black"
                      >
                        {dokter.nama_dokter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/antrian")}
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditAntrian; // Mengekspor komponen FormEditAntrian
