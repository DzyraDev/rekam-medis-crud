import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditDoctor = () => {
  const [formData, setFormData] = useState({
    nama_dokter: "",
    spesialis: "",
    nomor_lisensi: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctorById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/dokter/${id}`);
        setFormData({
          nama_dokter: response.data.nama_dokter,
          spesialis: response.data.spesialis,
          nomor_lisensi: response.data.nomor_lisensi,
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    fetchDoctorById();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/dokter/${id}`, formData);
      navigate("/dokter");
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
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-white">
              Edit Doctor Profile
            </h1>
            <p className="mt-2 text-blue-100">
              Update doctor information and credentials
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <p className="text-red-500">{msg}</p>
            <form onSubmit={updateDoctor} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="nama_dokter"
                    value={formData.nama_dokter}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="spesialis"
                    value={formData.spesialis}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Specialization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="nomor_lisensi"
                    value={formData.nomor_lisensi}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="License Number"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/dokter")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditDoctor;