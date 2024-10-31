import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Patient data states
  const [nama_pasien, setNamaPasien] = useState("");
  const [tanggal_lahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/me");
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);

      // Set patient data if available
      if (response.data.Pasiens) {
        setNamaPasien(response.data.Pasiens.nama_pasien);
        setTanggalLahir(response.data.Pasiens.tanggal_lahir);
        setAlamat(response.data.Pasiens.alamat);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage("Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/users/${user.uuid}`,
        {
          name,
          email,
          password,
          confPassword,
        }
      );
      setMessage(response.data.msg);
      fetchUserData(); // Refresh user data after update
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessage(error.response.data.msg || "Error updating user data");
    }
  };

  const handlePatientUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/pasien", // Adjust this endpoint as necessary
        {
          nama_pasien: nama_pasien,
          tanggal_lahir: tanggal_lahir,
          alamat,
        }
      );
      setMessage(response.data.msg);
      fetchUserData(); // Refresh user data after updating patient info
    } catch (error) {
      console.error("Error updating patient data:", error);
      setMessage(error.response.data.msg || "Error updating patient data");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* User Information Form */}
          <form onSubmit={handleUserUpdate} className="mb-8">
            {message && (
              <p className="text-red-600 text-center mb-4">{message}</p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Update User Profile
            </button>
          </form>

          {/* Patient Information Form */}
          <form onSubmit={handlePatientUpdate}>
            <h2 className="text-xl font-bold mb-4">Patient Information</h2>

            {message && (
              <p className="text-red-600 text-center mb-4">{message}</p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Nama Pasien
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={nama_pasien}
                onChange={(e) => setNamaPasien(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={tanggal_lahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Update Patient Information
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
