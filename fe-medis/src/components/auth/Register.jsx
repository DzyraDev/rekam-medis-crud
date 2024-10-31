import React, { useState } from "react"; // Mengimpor React dan hook useState
import { useDispatch, useSelector } from "react-redux"; // Mengimpor hook untuk Redux
import { useNavigate } from "react-router-dom"; // Mengimpor hook untuk navigasi
import axios from "axios"; // Mengimpor axios untuk melakukan permintaan HTTP

const RegisterUser = () => {
  // Mendefinisikan state untuk menyimpan data pengguna
  const [name, setName] = useState(""); // Nama pengguna
  const [email, setEmail] = useState(""); // Email pengguna
  const [password, setPassword] = useState(""); // Password pengguna
  const [confPassword, setConfPassword] = useState(""); // Konfirmasi password
  const [role] = useState("pasien"); // Set role sebagai "pasien" secara default
  const [msg, setMsg] = useState(""); // Pesan untuk menampilkan kesalahan
  const navigate = useNavigate(); // Mendapatkan fungsi navigasi

  // Mengambil data dari state Redux
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  // Fungsi untuk menyimpan pengguna baru
  const saveUser = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    try {
      // Mengirim permintaan POST untuk mendaftar pengguna baru
      await axios.post("http://localhost:5000/users", {
        name,
        email,
        password,
        confPassword,
        role,
      });
      navigate("/"); // Navigasi ke halaman utama setelah berhasil
    } catch (error) {
      // Menangani kesalahan jika ada
      if (error.response) {
        setMsg(error.response.data.msg); // Menyimpan pesan kesalahan
      }
    }
  };

  return (
    <section>
      <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
        <a href="#">
          <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
                />
              </svg>
            </div>
            Pendaftaran Pasien
          </div>
        </a>
        <div className="relative mt-12 w-full max-w-lg sm:mt-10">
          <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
          <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-lg rounded-lg border-white/20">
            <div className="flex flex-col p-6">
              <h3 className="text-xl font-semibold leading-6 tracking-tighter">Register</h3>
              <p className="mt-1.5 text-sm font-medium text-white/50">
                Silahkan masukkan data Anda untuk mendaftar sebagai pasien.
              </p>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={saveUser}> {/* Form untuk pendaftaran */}
                {isError && <p className="has-text-centered">{message}</p>} {/* Tampilkan pesan kesalahan jika ada */}

                {/* Input untuk Nama */}
                <div className="mt-4">
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                        Nama
                      </label>
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)} // Mengubah nilai nama
                      placeholder=""
                      autoComplete="off"
                      className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    />
                  </div>
                </div>

                {/* Input untuk Email */}
                <div className="mt-4">
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                        Email
                      </label>
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // Mengubah nilai email
                      placeholder=""
                      autoComplete="off"
                      className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    />
                  </div>
                </div>

                {/* Input untuk Password */}
                <div className="mt-4">
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                        Password
                      </label>
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Mengubah nilai password
                      placeholder="******"
                      autoComplete="on"
                      className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    />
                  </div>
                </div>

                {/* Input untuk Konfirmasi Password */}
                <div className="mt-4">
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                        Confirm Password
                      </label>
                    </div>
                    <input
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)} // Mengubah nilai konfirmasi password
                      placeholder="******"
                      autoComplete="on"
                      className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-white text-black h-10 px-4 py-2"
                    type="submit" // Tombol untuk mengirim form
                  >
                    {isLoading ? "Loading..." : "Register"} {/* Tampilkan teks sesuai status loading */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterUser; // Ekspor komponen
