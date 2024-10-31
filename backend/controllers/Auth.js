// src/controllers/authController.js
import User from "../models/UserModel.js"; // Mengimpor model User untuk berinteraksi dengan tabel pengguna
import { Pasien } from "../models/PasienModel.js"; // Mengimpor model Pasien untuk berinteraksi dengan tabel pasien
import argon2 from "argon2"; // Mengimpor argon2 untuk hashing dan verifikasi password
import { Dokter } from "../models/DokterModel.js"; // Mengimpor model Dokter untuk berinteraksi dengan tabel dokter

// Fungsi untuk menangani proses login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body; // Mendapatkan email dan password dari request body

    // Memastikan email dan password tidak kosong
    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan Password harus diisi" });
    }

    // Mencari pengguna berdasarkan email
    const user = await User.findOne({
      where: { email: email }
    });

    // Jika pengguna tidak ditemukan, mengembalikan status 404
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    
    // Memverifikasi password yang diberikan dengan password yang terhash
    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Password salah" });
    
    // Menyimpan ID pengguna dalam session
    req.session.id_user = user.uuid;

    // Mengembalikan data pengguna yang berhasil login
    const { uuid, name, role } = user;
    res.status(200).json({ uuid, name, email: user.email, role });
  } catch (error) {
    console.error("Login Error:", error); // Mencetak error ke konsol untuk debugging
    res.status(500).json({ msg: "Internal server error" }); // Mengembalikan status 500 jika terjadi kesalahan
  }
};

// Fungsi untuk menangani proses registrasi pengguna baru
export const Register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body; // Mendapatkan data dari request body

  // Memastikan password dan confirm password sama
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan confirm password tidak cocok" });
  }

  try {
    // Menghash password sebelum disimpan
    const hashPassword = await argon2.hash(password);
    
    // Membuat pengguna baru
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role
    });

    // Jika peran pengguna adalah pasien, buat catatan pasien kosong
    if (role === "pasien") {
      await Pasien.create({
        id_user: user.id_user, // Mengaitkan dengan ID pengguna
        nama_pasien: name, // Menggunakan nama pengguna sebagai nama pasien
        tanggal_lahir: null,
        alamat: null,
        id_antrian: null,
        id_rekam_medis: null
      });
    }

    // Mengembalikan pesan sukses registrasi
    res.status(200).json({ 
      msg: "Register Berhasil",
      user_id: user.id_user
    });

    // Kode yang dinonaktifkan di bawah ini dapat digunakan untuk pendaftaran dokter
    /*
    if (role === "dokter") {
      await Dokter.create({
        id_user: user.id_user,
        nama_dokter: name,
        spesialis: null,
        nomor_lisensi: null,
      });
    }
    */

  } catch (error) {
    // Menangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Fungsi untuk mengambil informasi pengguna yang sedang login
export const Me = async (req, res) => {
  // Memeriksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res
      .status(401)
      .json({ msg: "Mohon login ke akun Anda terlebih dahulu." });
  }

  try {
    // Mencari pengguna berdasarkan UUID
    const user = await User.findOne({
      attributes: ["uuid", "name", "email", "password", "role"], // Mengambil atribut tertentu dari pengguna
      where: {
        uuid: req.session.id_user,
      },
      include: [ // Mengikutkan model Pasien dan Dokter untuk data terkait
        {
          model: Pasien,
          attributes: [
            "id_pasien",
            "nama_pasien",
            "tanggal_lahir",
            "alamat",
            "id_antrian",
            "id_rekam_medis",
          ],
          required: false,
        },
        {
          model: Dokter,
          attributes: [
            "id_dokter",
            "nama_dokter",
            "spesialis",
            "nomor_lisensi",
          ],
          required: false,
        },
      ],
    });

    // Jika pengguna tidak ditemukan
    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan." });
    }

    // Mengembalikan data pengguna
    res.status(200).json(user);
  } catch (error) {
    // Menangani error yang terjadi
    console.error("Error:", error); // Log error untuk debugging
    res.status(500).json({ msg: "Terjadi kesalahan, silakan coba lagi." }); // Mengembalikan status 500 jika terjadi kesalahan
  }
};

// Fungsi untuk menangani proses logout
export const Logout = async (req, res) => {
  req.session.destroy((err) => { // Menghancurkan session pengguna
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" }); // Mengembalikan pesan sukses logout
  });
};
