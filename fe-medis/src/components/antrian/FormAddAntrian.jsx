import React, { useEffect, useState } from "react"; // Mengimpor React dan hook yang diperlukan
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP requests
import { useNavigate } from "react-router-dom"; // Mengimpor hook untuk navigasi

const FormAddAntrian = () => {
  // Mendefinisikan state yang dibutuhkan
  const [gejala, setGejala] = useState(""); // Menyimpan gejala pasien
  const [nama_pasien, setPas] = useState(""); // Menyimpan ID pasien
  const [nama_dokter, setDokter] = useState(""); // Menyimpan ID dokter
  const [msg, setMsg] = useState(""); // Menyimpan pesan kesalahan
  const [dokter, setDoctors] = useState([]); // Menyimpan daftar dokter
  const [queueCount, setQueueCount] = useState(0); // Menyimpan jumlah antrian saat ini

  const [isLoading, setIsLoading] = useState(false); // Menyimpan status loading
  const navigate = useNavigate(); // Mendapatkan fungsi navigasi

  // useEffect untuk menghitung jumlah antrian dokter saat ini
  useEffect(() => {
    if (nama_dokter) {
      axios
        .get(`http://localhost:5000/antrian/count/${nama_dokter}`)
        .then((response) => setQueueCount(response.data.count)) // Mengupdate queueCount dengan data yang didapat
        .catch((error) => console.error("Error fetching queue count:", error)); // Menangani kesalahan
    }
  }, [nama_dokter]); // Menjalankan efek ini ketika nama_dokter berubah

  // useEffect untuk mengambil data dokter dan pasien
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, pasienRes] = await Promise.all([
          axios.get("http://localhost:5000/dokter"),
          axios.get("http://localhost:5000/pasien"),
        ]);

        setDoctors(doctorsRes.data); // Menyimpan data dokter yang didapat

        // Mengambil ID pengguna dari localStorage
        const currentUserId = localStorage.getItem("userId"); // Mengambil ID pengguna
        const currentPatient = pasienRes.data.find(
          (p) => p.id_user === currentUserId // Mencari pasien berdasarkan ID pengguna
        );

        if (currentPatient) {
          setPas(currentPatient.id_pasien); // Menyimpan ID pasien saat ini
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Menangani kesalahan
        setMsg("Error mengambil data dokter"); // Mengupdate pesan kesalahan
      }
    };

    fetchData(); // Memanggil fungsi fetchData
  }, []); // Menjalankan efek ini sekali saat komponen dipasang

  // Fungsi untuk menyimpan antrian
  const saveAntrian = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setIsLoading(true); // Mengubah status loading menjadi true
    try {
      const userRole = localStorage.getItem("userRole"); // Mengambil peran pengguna dari localStorage
      const payload = {
        gejala: gejala, // Data gejala
        id_pasien: nama_pasien, // ID pasien
        id_dokter: nama_dokter, // ID dokter
      };

      // Jika pengguna adalah admin, meminta nomor antrian secara manual
      if (userRole === "admin") {
        payload.no_antrian = parseInt(prompt("Enter queue number manually:")); // Meminta input nomor antrian
      }

      const response = await axios.post(
        "http://localhost:5000/antrian",
        payload // Mengirimkan data ke server
      );

      if (response.data) {
        navigate("/antrian"); // Navigasi ke halaman antrian jika berhasil
      }
    } catch (error) {
      // Tangani kesalahan jika terjadi
    } finally {
      setIsLoading(false); // Mengubah status loading menjadi false
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> {/* Latar belakang */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Kontainer utama */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden"> {/* Kotak untuk form */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600"> {/* Header form */}
            <h1 className="text-3xl font-bold text-white">Tambahkan Antrian Baru</h1> {/* Judul */}
            <p className="mt-2 text-blue-100">Silakan isi detail berikut</p> {/* Petunjuk */}
          </div>
          <div className="p-6"> {/* Konten form */}
            <form onSubmit={saveAntrian} className="space-y-6"> {/* Formulir */}
              {msg && ( // Jika ada pesan kesalahan, tampilkan
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-700">{msg}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                {/* Input tersembunyi untuk ID pasien */}
                <input
                  type="hidden"
                  value={nama_pasien}
                  onChange={(e) => setPas(e.target.value)} // Mengubah nilai ID pasien
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gejala
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={gejala}
                    onChange={(e) => setGejala(e.target.value)} // Mengubah nilai gejala
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
                    onChange={(e) => setDokter(e.target.value)} // Mengubah nilai dokter yang dipilih
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Pilih Dokter</option> {/* Pilihan awal */}
                    {dokter.map((dokter) => ( // Mengulangi dokter dari daftar dokter
                      <option
                        key={dokter.id_dokter}
                        value={dokter.id_dokter}
                        className="text-black"
                      >
                        {dokter.nama_dokter} | {dokter.spesialis} {/* Nama dokter */}
                      </option>
                    ))}
                  </select>

                  {nama_dokter && ( // Jika dokter dipilih, tampilkan jumlah antrian
                    <p className="mt-2 text-sm text-gray-600">
                      Current queue for this doctor: {queueCount}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/antrian")} // Navigasi kembali ke halaman antrian
                  disabled={isLoading} // Nonaktifkan jika dalam status loading
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  disabled={isLoading} // Nonaktifkan jika dalam status loading
                >
                  {isLoading ? "Menyimpan..." : "Simpan"} {/* Tampilkan teks sesuai status loading */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddAntrian; // Ekspor komponen
