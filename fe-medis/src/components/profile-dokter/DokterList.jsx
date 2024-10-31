import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [messageUser, setMessageUser] = useState("");
  const [messageDokter, setMessageDokter] = useState(""); // Separate message for Dokter form
  const [isLoading, setIsLoading] = useState(true);

  // Dokter data states
  const [nama_dokter, setNamaDokter] = useState("");
  const [spesialis, setSpesialis] = useState("");
  const [nomor_lisensi, setNomorLisensi] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

const fetchUserData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/me");
    console.log("User Data:", response.data); // Periksa apakah Dokters masih ada

    const { name, email, Dokters } = response.data;
    setUser(response.data);
    setName(name);
    setEmail(email);

    if (Dokters) {
      console.log("Dokters Data:", Dokters); // Tambahkan ini untuk memeriksa apakah data Dokters di-reset
      const { nama_dokter, spesialis, nomor_lisensi } = Dokters;
      setNamaDokter(nama_dokter || "");
      setSpesialis(spesialis || "");
      setNomorLisensi(nomor_lisensi || "");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    setMessageUser("Error fetching user data");
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
      setMessageUser(response.data.msg);
      fetchUserData(); // Refresh user data after update
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessageUser(error.response.data.msg || "Error updating user data");
    }
  };

const handleDokterUpdate = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`http://localhost:5000/dokter`, {
      nama_dokter,
      spesialis,
      nomor_lisensi,
    });
    console.log("Dokter Update Response:", response.data); // Cek respons di sini
    setMessageDokter(response.data.msg);
    fetchUserData(); // Refresh dokter data after update
  } catch (error) {
    console.error("Error updating dokter data:", error);
    setMessageDokter(error.response.data.msg || "Error updating dokter data");
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
            {messageUser && (
              <p className="text-red-600 text-center mb-4">{messageUser}</p>
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

          {/* Dokter Information Form */}
          <form onSubmit={handleDokterUpdate}>
            <h2 className="text-xl font-bold mb-4">Dokter Information</h2>

            {messageDokter && (
              <p className="text-red-600 text-center mb-4">{messageDokter}</p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Nama Dokter
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={nama_dokter}
                onChange={(e) => setNamaDokter(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Spesialis
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={spesialis}
                onChange={(e) => setSpesialis(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Nomor Lisensi
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={nomor_lisensi}
                onChange={(e) => setNomorLisensi(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Update Dokter Information
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
