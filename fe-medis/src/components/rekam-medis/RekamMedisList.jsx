import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PlusCircle, Edit2, Trash2, Search, Printer } from "lucide-react";
import { useSelector } from "react-redux";

const RekamMedisList = () => {
  const [rekam_medis, setRekamMedis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getRekamMedis();
  }, []);

  const getRekamMedis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rekam-medis");
      setRekamMedis(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRekamMedis = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/rekam-medis/${id}`);
        getRekamMedis();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const filteredRekamMedis = rekam_medis.filter((record) =>
    record.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printRecords = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekam Medis</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all medical records
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/rekam-medis/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white font-medium rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Record
          </Link>
          <button
            onClick={printRecords}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 
                       text-white font-medium rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print All
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search records..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Dokter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredRekamMedis.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRekamMedis.map((rekamMedis, index) => (
                  <tr
                    key={rekamMedis.id_rekam_medis}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rekamMedis.diagnosa || "Not yet diagnosed"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rekamMedis.resep || "No prescription yet"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rekamMedis.catatan || "No notes yet"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(rekamMedis.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rekamMedis.nama_pasien}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rekamMedis.nama_dokter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/rekam-medis/print/${rekamMedis.id_rekam_medis}`}
                        className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 
                                   hover:bg-green-200 rounded-lg transition-colors duration-200"
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        Print
                      </Link>

                      {(user?.role === "admin" || user?.role === "dokter") &&(
                <>
                      <Link
                        to={`/rekam-medis/edit/${rekamMedis.id_rekam_medis}`}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 
                                   hover:bg-indigo-200 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        {rekamMedis.diagnosa ? "Edit" : "Complete"}
                      </Link>
                      <button
                        onClick={() =>
                          deleteRekamMedis(rekamMedis.id_rekam_medis)
                        }
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 
                                   hover:bg-red-200 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                      </>
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

export default RekamMedisList;
