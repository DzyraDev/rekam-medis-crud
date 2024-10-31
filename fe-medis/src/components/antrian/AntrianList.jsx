import React, { useState, useEffect } from "react"; // Mengimpor React dan hook useState, useEffect
import { Link } from "react-router-dom"; // Mengimpor Link untuk navigasi
import axios from "axios"; // Mengimpor axios untuk HTTP requests
import { PlusCircle, Edit2, Trash2, Search } from "lucide-react"; // Mengimpor ikon dari lucide-react
import { useSelector } from "react-redux"; // Mengimpor useSelector dari Redux
import debounce from "lodash.debounce"; // Mengimpor debounce untuk mengoptimalkan pencarian

const AntrianList = () => {
  const [antrian, setAntrian] = useState([]); // State untuk menyimpan daftar antrian
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan kata kunci pencarian
  const [isLoading, setIsLoading] = useState(true); // State untuk menandai status loading
  const [loadingAction, setLoadingAction] = useState(false); // State untuk menandai status action loading
  const { user } = useSelector((state) => state.auth); // Mengambil data pengguna dari Redux

  useEffect(() => {
    getAntrian(); // Memanggil fungsi untuk mengambil data antrian saat komponen di-mount
  }, []);

  const getAntrian = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/antrian`, {
        withCredentials: true, // Mengizinkan pengiriman cookie session
      });
      // Menyaring antrian yang statusnya bukan 'terpanggil'
      const filteredAntrian = response.data.filter(
        (item) => item.status !== "terpanggil"
      );
      setAntrian(filteredAntrian); // Menyimpan antrian yang telah difilter ke state
    } catch (error) {
      console.error("Error fetching data:", error); // Menangani error
    } finally {
      setIsLoading(false); // Menandai loading selesai
    }
  };

  const deleteAntrian = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setLoadingAction(true); // Menandai bahwa sedang melakukan aksi loading
      try {
        await axios.delete(`http://localhost:5000/antrian/${id}`); // Menghapus antrian
        getAntrian(); // Memanggil kembali fungsi untuk mendapatkan data antrian
      } catch (error) {
        console.error("Error deleting entry:", error); // Menangani error
      } finally {
        setLoadingAction(false); // Menandai loading selesai
      }
    }
  };

  const handleSearch = debounce((event) => {
    setSearchTerm(event.target.value); // Mengatur kata kunci pencarian
  }, 300); // Menambahkan debounce selama 300ms

  // Memfilter antrian berdasarkan kata kunci pencarian
  const filteredAntrian = antrian.filter((item) =>
    item.gejala.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateAntrianStatus = async (id, action) => {
    setLoadingAction(true); // Menandai loading
    try {
      const response = await axios.put(
        `http://localhost:5000/antrian/${id}/status`,
        { action }
      );

      if (action === "panggil" && response.data.success) {
        await createRekamMedis(id); // Membuat rekam medis jika status diubah menjadi 'panggil'
      }

      getAntrian(); // Memanggil kembali fungsi untuk mendapatkan data antrian
    } catch (error) {
      console.error("Error updating antrian status:", error); // Menangani error
    } finally {
      setLoadingAction(false); // Menandai loading selesai
    }
  };

  const createRekamMedis = async (id_antrian) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/rekam-medis/create-from-antrian",
        { id_antrian }
      );
      console.log("Rekam medis created:", response.data); // Menginformasikan bahwa rekam medis telah dibuat
    } catch (error) {
      console.error("Error creating rekam medis:", error); // Menangani error
    }
  };

  // Fungsi untuk mendapatkan kelas status berdasarkan status antrian
  const getStatusClass = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700";
      case "terpanggil":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">List of Antrian</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and view all antrian</p>
        </div>
        <Link
          to="/antrian/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Antrian
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by gejala..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Antrian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gejala</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredAntrian.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No antrian found</td>
                </tr>
              ) : (
                filteredAntrian.map((item) => (
                  <tr key={item.id_antrian} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.no_antrian}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.gejala}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nama_pasien}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nama_dokter}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200 ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user?.role === "admin" && (
                        <>
                          <Link
                            to={`/antrian/edit/${item.id_antrian}`}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors duration-200"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteAntrian(item.id_antrian)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {loadingAction ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      )}
                      {user?.role === "dokter" && (
                        <>
                          {item.status === "menunggu" && (
                            <button
                              onClick={() => updateAntrianStatus(item.id_antrian, "panggil")}
                              className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200"
                            >
                              Panggil
                            </button>
                          )}
                          {item.status === "terpanggil" && (
                            <button
                              onClick={() => updateAntrianStatus(item.id_antrian, "selesai")}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                            >
                              Selesai
                            </button>
                          )}
                        </>
                      )}
                      {(item.status === "menunggu" || item.status === "terpanggil") && (
                        <button
                          onClick={() => updateAntrianStatus(item.id_antrian, "batal")}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                        >
                          Batalkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AntrianList; // Mengekspor komponen AntrianList
