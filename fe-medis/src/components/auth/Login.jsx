import React, { useState, useEffect } from "react"; // Mengimpor React dan hook yang diperlukan
import { useDispatch, useSelector } from "react-redux"; // Mengimpor hook untuk Redux
import { useNavigate } from "react-router-dom"; // Mengimpor hook untuk navigasi
import { LoginUser, reset } from "../../features/authSlice"; // Mengimpor aksi dari slice Redux

const Login = () => {
  // Mendefinisikan state untuk email dan password
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const dispatch = useDispatch(); // Mendapatkan fungsi dispatch dari Redux
  const navigate = useNavigate(); // Mendapatkan fungsi navigasi

  // Mengambil data dari state Redux
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  // useEffect untuk mengarahkan pengguna setelah login
  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard"); // Navigasi ke halaman dashboard
    }
    dispatch(reset()); // Mereset status auth
  }, [user, isSuccess, dispatch, navigate]); // Menjalankan efek ini saat user atau isSuccess berubah

  // Fungsi untuk menangani login
  const Auth = (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    dispatch(LoginUser({ email, password })); // Mengirimkan aksi login dengan email dan password
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
            Ardiansyah Putra
          </div>
        </a>
        <div className="relative mt-12 w-full max-w-lg sm:mt-10">
          <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
          <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-lg rounded-lg border-white/20">
            <div className="flex flex-col p-6">
              <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3> {/* Judul */}
              <p className="mt-1.5 text-sm font-medium text-white/50">
                Welcome back, enter your credentials to continue. {/* Petunjuk */}
              </p>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={Auth}> {/* Form untuk login */}
                {isError && <p className="has-text-centered">{message}</p>} {/* Tampilkan pesan kesalahan jika ada */}

                <div className="mt-4">
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                        Username
                      </label>
                      <div className="absolute right-3 translate-y-2 text-green-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
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
                      autoComplete="off"
                      className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="remember"
                      className="outline-none focus:outline focus:outline-sky-300"
                    />
                    <span className="text-xs">Remember me</span>
                  </label>
                  <a
                    className="text-sm font-medium text-foreground underline"
                    href="/forgot-password" // Tautan ke halaman lupa password
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-4 flex items-center justify-end gap-x-2">
                  <a
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2"
                    href="/register" // Tautan ke halaman registrasi
                  >
                    Register
                  </a>
                  <button
                    className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-white text-black h-10 px-4 py-2"
                    type="submit" // Tombol untuk mengirim form
                  >
                    {isLoading ? "Loading..." : "Login"} {/* Tampilkan teks sesuai status loading */}
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

export default Login; // Ekspor komponen
