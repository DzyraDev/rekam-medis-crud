import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddRekamMedis = () => {
  const [diagnosa, setName] = useState("");
  const [resep, setRes] = useState("");
  const [catatan, setCat] = useState("");
  const [tanggal, setTang] = useState("");
  const [nama_pasien, setPas] = useState("");
  const [nama_dokter, setDok] = useState("");
  const [nomor_antrian, setAn] = useState("");
  const [msg, setMsg] = useState("");
  const [dokter, setDoctors] = useState([]);
  const [pasien, setPatients] = useState([]);
  const [antrian, setQueues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, queuesRes] = await Promise.all([
          axios.get("http://localhost:5000/dokter"),
          axios.get("http://localhost:5000/pasien"),
          axios.get("http://localhost:5000/antrian"),
        ]);
        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
        setQueues(queuesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/rekam-medis", {
        diagnosa,
        resep,
        catatan,
        tanggal,
        id_pasien: nama_pasien,
        id_dokter: nama_dokter,
        id_antrian: nomor_antrian,
      });
      navigate("/rekam-medis");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-white">
              Add New Rekam Medis
            </h1>
            <p className="mt-2 text-blue-100">Fill out the details below</p>
          </div>
          <div className="p-6">
            <form onSubmit={saveProduct} className="space-y-6">
              <p className="text-red-500 text-center">{msg}</p>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Diagnosa
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={diagnosa}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Diagnosa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resep
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={resep}
                    onChange={(e) => setRes(e.target.value)}
                    placeholder="Resep Obat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catatan
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={catatan}
                    onChange={(e) => setCat(e.target.value)}
                    placeholder="Catatan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={tanggal}
                    onChange={(e) => setTang(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Pasien
                  </label>
                  <select
                    value={nama_pasien}
                    onChange={(e) => setPas(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Pasien</option>
                    {pasien.map((patient) => (
                      <option key={patient.id} value={patient.id_pasien}>
                        {patient.nama_pasien}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Dokter
                  </label>
                  <select
                    value={nama_dokter}
                    onChange={(e) => setDok(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Dokter</option>
                    {dokter.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id_dokter}
                        className="text-black"
                      >
                        {doctor.nama_dokter}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nomor Antrian
                  </label>
                  <select
                    value={nomor_antrian}
                    onChange={(e) => setAn(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Antrian</option>
                    {antrian.map((queue) => (
                      <option key={queue.id} value={queue.id_antrian}>
                        {queue.no_antrian}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/rekam-medis")} // Cancel button
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddRekamMedis;
