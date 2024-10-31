import Users from "../models/UserModel.js"; // Mengimpor model Users
import { Pasien } from "../models/PasienModel.js"; // Mengimpor model Pasien
import { Dokter } from "../models/DokterModel.js"; // Mengimpor model Dokter

// Middleware untuk memverifikasi apakah pengguna sudah login
export const verifyUser = async (req, res, next) => {
  // Memeriksa apakah ID pengguna ada dalam sesi
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login ke akun anda terlebih dahulu" });
  }

  // Mencari pengguna berdasarkan UUID yang tersimpan dalam sesi
  const user = await Users.findOne({
    where: { uuid: req.session.id_user },
  });

  // Jika pengguna tidak ditemukan, kirim respons 404
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  // Simpan informasi pengguna dalam request untuk digunakan di middleware selanjutnya
  req.id_user = user.id_user; // Menyimpan ID pengguna
  req.role = user.role; // Menyimpan role pengguna
  next(); // Melanjutkan ke middleware berikutnya
};

// Middleware untuk membatasi akses ke admin saja
export const adminOnly = async (req, res, next) => {
  // Mencari pengguna berdasarkan UUID yang tersimpan dalam sesi
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: { uuid: req.session.id_user },
  });

  // Jika pengguna tidak ditemukan, kirim respons 404
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  // Memeriksa apakah pengguna memiliki role yang sesuai
  if (user.role !== "admin" && user.role !== "dokter" && user.role !== "pasien") {
    return res.status(403).json({ msg: "Akses Terlarang" });
  }

  next(); // Melanjutkan ke middleware berikutnya
};

// Middleware untuk membatasi akses ke dokter saja
export const doctorOnly = async (req, res, next) => {
  // Memeriksa apakah pengguna sudah login dan memiliki role dokter
  if (!req.session.id_user || req.session.role !== "dokter") {
    return res.status(403).json({ msg: "Akses Terlarang untuk non-Dokter" });
  }

  // Mencari data dokter berdasarkan ID dokter yang tersimpan dalam sesi
  const dokter = await Dokter.findOne({
    attributes: [
      "id_dokter",
      "nama_dokter",
      "spesialis",
      "nomor_lisensi",
      "id_user",
      "id_antrian",
      "id_rekam_medis",
    ],
    where: { id_dokter: req.session.id_dokter },
  });

  // Jika dokter tidak ditemukan, kirim respons 404
  if (!dokter) {
    return res.status(404).json({ msg: "Dokter tidak ditemukan" });
  }

  next(); // Melanjutkan ke middleware berikutnya
};

// Middleware untuk membatasi akses ke pasien saja
export const patientOnly = async (req, res, next) => {
  // Memeriksa apakah pengguna sudah login dan memiliki role pasien
  if (!req.session.id_user || req.session.role !== "pasien") {
    return res.status(403).json({ msg: "Akses Terlarang untuk non-Pasien" });
  }

  // Mencari data pasien berdasarkan ID pasien yang tersimpan dalam sesi
  const pasien = await Pasien.findOne({
    attributes: [
      "id_pasien",
      "nama_lengkap",
      "tanggal_lahir",
      "alamat",
      "kelamin",
      "id_antrian",
      "id_rekam_medis",
      "id_user",
    ],
    where: { id_pasien: req.session.id_pasien },
  });

  // Jika pasien tidak ditemukan, kirim respons 404
  if (!pasien) {
    return res.status(404).json({ msg: "Pasien tidak ditemukan" });
  }

  next(); // Melanjutkan ke middleware berikutnya
};
