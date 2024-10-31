import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditRekamMedis = () => {
  const [diagnosa, setName] = useState("");
  const [resep, setRes] = useState("");
  const [catatan, setCat] = useState("");
  const [tanggal, setTang] = useState("");
  const [nama_pasien, setPas] = useState("");
  const [nama_dokter, setDok] = useState("");
  const [no_antrian, setAn] = useState("");
  const [msg, setMsg] = useState("");
  const [dokter, setDoctors] = useState([]);
  const [pasien, setPatients] = useState([]);
  const [antrian, setQueues] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/rekam-medis/${id}`
        );
        setName(response.data.diagnosa);
        setRes(response.data.resep);
        setCat(response.data.catatan);
        setTang(response.data.tanggal);
        setPas(response.data.nama_pasien);
        setDok(response.data.nama_dokter);
        setAn(response.data.no_antrian);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]);
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
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/rekam-medis/${id}`, {
        diagnosa: diagnosa,
        resep: resep,
        catatan: catatan,
        tanggal: tanggal,
        nama_pasien: nama_pasien,
        nama_dokter: nama_dokter,
        no_antrian: no_antrian,
      });
      navigate("/rekam-medis");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">REKAM MEDIS</h1>
      <h2 className="subtitle">REKAM MEDIS FORM</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateProduct}>
              <p className="has-text-centered">{msg}</p>
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

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={tanggal}
                  onChange={(e) => setTang(e.target.value)}
                />
              </div> */}
              {/* 
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
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Antrian
                </label>
                <select
                  value={no_antrian}
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
              </div> */}

              <div className="field">
                <div className="control mt-10">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditRekamMedis;
